import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKey = 'medicamentos';
        this.initialized = false;
    }

    /**
     * Inicializa la DB y aplica migraciones necesarias (añadir columnas si faltan).
     */
    async initialize() {
        if (this.initialized) return;
        this.initialized = true;

        if (Platform.OS === 'web') {
            console.log("Usando LocalStorage para WEB");
            return;
        }

        console.log("Usando SQLite en dispositivo");
        // Abre la base de datos (en tu proyecto usabas openDatabaseAsync)
        this.db = await SQLite.openDatabaseAsync("meditrack.db");

        // Crear la tabla si no existe con el esquema nuevo
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS medicamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                dosis TEXT NOT NULL,
                frecuencia TEXT NOT NULL,
                notas TEXT,
                hora_inicio TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // --- Migración segura: comprobar columnas existentes y añadir las que falten ---
        try {
            const cols = await this.db.getAllAsync("PRAGMA table_info(medicamentos);");
            const existing = (cols || []).map(c => (c.name || c.column_name || c.COLUMN_NAME || '').toString().toLowerCase());
            // Añadir columna 'notas' si no existe
            if (!existing.includes('notas')) {
                console.log("Migración: añadiendo columna 'notas' a medicamentos");
                await this.db.execAsync("ALTER TABLE medicamentos ADD COLUMN notas TEXT;");
            }
            // Añadir columna 'hora_inicio' si no existe
            if (!existing.includes('hora_inicio')) {
                console.log("Migración: añadiendo columna 'hora_inicio' a medicamentos");
                await this.db.execAsync("ALTER TABLE medicamentos ADD COLUMN hora_inicio TEXT;");
            }
            // Asegurarse de que fecha_creacion exista (si por alguna razón falta)
            if (!existing.includes('fecha_creacion')) {
                console.log("Migración: añadiendo columna 'fecha_creacion' a medicamentos");
                await this.db.execAsync("ALTER TABLE medicamentos ADD COLUMN fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP;");
            }
        } catch (err) {
            // Si el método PRAGMA o la API de tu wrapper difiere, logueamos el error pero no abortamos
            console.warn("No se pudo inspeccionar esquema para migraciones automáticas:", err);
        }
    }

    async getAll() {
        if (Platform.OS === "web") {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        }
        return await this.db.getAllAsync("SELECT * FROM medicamentos ORDER BY id DESC");
    }

    /**
     * add admite ahora:
     * - add({ nombre, dosis, frecuencia, notas, hora_inicio, fecha_creacion })
     * - add(nombre, dosis, frecuencia) (firma antigua)
     */
    async add(arg1, arg2, arg3) {
        if (Platform.OS === "web") {
            const medicamentos = await this.getAll();

            let nuevo;
            if (typeof arg1 === "object") {
                const { nombre, dosis, frecuencia, notas = "", hora_inicio = "", fecha_creacion = null } = arg1;
                nuevo = {
                    id: Date.now(),
                    nombre,
                    dosis,
                    frecuencia,
                    notas,
                    hora_inicio,
                    fecha_creacion: fecha_creacion || new Date().toISOString(),
                };
            } else {
                const nombre = arg1;
                const dosis = arg2;
                const frecuencia = arg3;
                nuevo = {
                    id: Date.now(),
                    nombre,
                    dosis,
                    frecuencia,
                    notas: "",
                    hora_inicio: "",
                    fecha_creacion: new Date().toISOString(),
                };
            }

            medicamentos.unshift(nuevo);
            localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
            return nuevo;
        }

        // Native SQLite path
        if (typeof arg1 === "object") {
            const { nombre, dosis, frecuencia, notas = "", hora_inicio = "", fecha_creacion = null } = arg1;
            const fecha = fecha_creacion || new Date().toISOString();

            const result = await this.db.runAsync(
                "INSERT INTO medicamentos (nombre, dosis, frecuencia, notas, hora_inicio, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)",
                [nombre, dosis, frecuencia, notas, hora_inicio, fecha]
            );

            return {
                id: result.lastInsertRowId,
                nombre,
                dosis,
                frecuencia,
                notas,
                hora_inicio,
                fecha_creacion: fecha,
            };
        } else {
            // firma antigua: (nombre, dosis, frecuencia)
            const nombre = arg1;
            const dosis = arg2;
            const frecuencia = arg3;
            const fecha = new Date().toISOString();

            const result = await this.db.runAsync(
                "INSERT INTO medicamentos (nombre, dosis, frecuencia, fecha_creacion) VALUES (?, ?, ?, ?)",
                [nombre, dosis, frecuencia, fecha]
            );

            return {
                id: result.lastInsertRowId,
                nombre,
                dosis,
                frecuencia,
                notas: "",
                hora_inicio: "",
                fecha_creacion: fecha,
            };
        }
    }

    /**
     * modificar admite:
     * - modificar(id, { nombre, dosis, frecuencia, notas, hora_inicio })
     * - modificar(id, nombre, dosis, frecuencia) (firma antigua)
     */
    async modificar(id, arg2, arg3, arg4) {
        if (Platform.OS === "web") {
            const medicamentos = await this.getAll();
            const index = medicamentos.findIndex(m => m.id === id);
            if (index !== -1) {
                if (typeof arg2 === "object") {
                    const { nombre, dosis, frecuencia, notas = medicamentos[index].notas || "", hora_inicio = medicamentos[index].hora_inicio || "" } = arg2;
                    medicamentos[index].nombre = nombre;
                    medicamentos[index].dosis = dosis;
                    medicamentos[index].frecuencia = frecuencia;
                    medicamentos[index].notas = notas;
                    medicamentos[index].hora_inicio = hora_inicio;
                } else {
                    medicamentos[index].nombre = arg2;
                    medicamentos[index].dosis = arg3;
                    medicamentos[index].frecuencia = arg4;
                }
                localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
            }
            return true;
        }

        // Native SQLite path
        if (typeof arg2 === "object") {
            const { nombre, dosis, frecuencia, notas = "", hora_inicio = null } = arg2;
            await this.db.runAsync(
                "UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ?, notas = ?, hora_inicio = ? WHERE id = ?",
                [nombre, dosis, frecuencia, notas, hora_inicio, id]
            );
        } else {
            // firma antigua
            await this.db.runAsync(
                "UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ? WHERE id = ?",
                [arg2, arg3, arg4, id]
            );
        }
        return true;
    }

    async borrar(id) {
        if (Platform.OS === "web") {
            let medicamentos = await this.getAll();
            medicamentos = medicamentos.filter(m => m.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
            return true;
        }

        await this.db.runAsync("DELETE FROM medicamentos WHERE id = ?", [id]);
        return true;
    }
}

export default new DatabaseService();