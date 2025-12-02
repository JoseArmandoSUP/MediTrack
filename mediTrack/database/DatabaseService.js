import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKey = 'medicamentos';
    }

    async initialize() {
        if (this.initialized) return;
        this.initialized = true;

        if (Platform.OS === 'web') {
            console.log("Usando LocalStorage para WEB");
            return;
        }

        console.log("Usando SQLite en dispositivo");
        this.db = await SQLite.openDatabaseAsync("meditrack.db");

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS medicamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                dosis TEXT NOT NULL,
                frecuencia TEXT NOT NULL,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    async getAll() {
        if (Platform.OS === "web") {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        }
        return await this.db.getAllAsync("SELECT * FROM medicamentos ORDER BY id DESC");
    }

    async add(nombre, dosis, frecuencia) {
        if (Platform.OS === "web") {
            const medicamentos = await this.getAll();
            const nuevo = {
                id: Date.now(),
                nombre,
                dosis,
                frecuencia,
                fecha_creacion: new Date().toISOString(),
            };
            medicamentos.unshift(nuevo);
            localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
            return nuevo;
        }

        const result = await this.db.runAsync(
            "INSERT INTO medicamentos (nombre, dosis, frecuencia) VALUES (?, ?, ?)",
            [nombre, dosis, frecuencia]
        );

        return {
            id: result.lastInsertRowId,
            nombre,
            dosis,
            frecuencia,
            fecha_creacion: new Date().toISOString(),
        };
    }

    async modificar(id, nombre, dosis, frecuencia) {
        if (Platform.OS === "web") {
            const medicamentos = await this.getAll();
            const index = medicamentos.findIndex(m => m.id === id);
            if (index !== -1) {
                medicamentos[index].nombre = nombre;
                medicamentos[index].dosis = dosis;
                medicamentos[index].frecuencia = frecuencia;
                localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
            }
            return true;
        }

        await this.db.runAsync(
            "UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ? WHERE id = ?",
            [nombre, dosis, frecuencia, id]
        );
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
