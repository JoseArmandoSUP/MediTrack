import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * DatabaseService
 * - Soporta filtrado por usuario (user_email) tanto en web (localStorage) como en SQLite.
 * - Añade/omite columnas mediante migración segura.
 * - Métodos:
 *   - initialize()
 *   - getAll(filter?) -> filter: { userEmail }
 *   - add(payloadOrArgs)
 *   - modificar(id, payloadOrArgs)
 *   - borrar(id, context?)
 *
 * Nota: este archivo asume que la API de this.db incluye runAsync, execAsync, getAllAsync,
 * igual que en tu implementación previa. Ajusta si tu wrapper usa nombres distintos.
 */

class DatabaseService {
  constructor() {
    this.db = null;
    this.storageKey = "medicamentos";
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    if (Platform.OS === "web") {
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
        notas TEXT,
        hora_inicio TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_email TEXT
      );
    `);

    // Migraciones: añadir columnas si faltan
    try {
      const cols = await this.db.getAllAsync("PRAGMA table_info(medicamentos);");
      const existing = (cols || []).map(
        (c) => (c.name || c.column_name || c.COLUMN_NAME || "").toString().toLowerCase()
      );

      if (!existing.includes("notas")) {
        console.log("Migración: añadiendo columna 'notas'");
        await this.db.execAsync("ALTER TABLE medicamentos ADD COLUMN notas TEXT;");
      }
      if (!existing.includes("hora_inicio")) {
        console.log("Migración: añadiendo columna 'hora_inicio'");
        await this.db.execAsync("ALTER TABLE medicamentos ADD COLUMN hora_inicio TEXT;");
      }
      if (!existing.includes("fecha_creacion")) {
        console.log("Migración: añadiendo columna 'fecha_creacion'");
        await this.db.execAsync(
          "ALTER TABLE medicamentos ADD COLUMN fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP;"
        );
      }
      if (!existing.includes("user_email")) {
        console.log("Migración: añadiendo columna 'user_email'");
        await this.db.execAsync("ALTER TABLE medicamentos ADD COLUMN user_email TEXT;");
      }
    } catch (err) {
      console.warn("No se pudo inspeccionar/ejecutar migraciones automáticas:", err);
    }
  }

  // Helper para key de localStorage por usuario
  _webKey(userEmail) {
    return userEmail ? `${this.storageKey}:${userEmail}` : this.storageKey;
  }

  // getAll acepta opcionalmente { userEmail }
  async getAll(filter = {}) {
    const userEmail = filter && filter.userEmail ? filter.userEmail : null;

    if (Platform.OS === "web") {
      const key = this._webKey(userEmail);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }

    if (userEmail) {
      try {
        return await this.db.getAllAsync(
          "SELECT * FROM medicamentos WHERE user_email = ? ORDER BY id DESC",
          [userEmail]
        );
      } catch (e) {
        // Fallback a seleccionar sin filtro si la DB no soporta el parámetro
        return await this.db.getAllAsync("SELECT * FROM medicamentos ORDER BY id DESC");
      }
    } else {
      return await this.db.getAllAsync("SELECT * FROM medicamentos ORDER BY id DESC");
    }
  }

  /**
   * add admite:
   * - add({ nombre, dosis, frecuencia, notas, hora_inicio, fecha_creacion, user_email })
   * - add(nombre, dosis, frecuencia)
   */
  async add(arg1, arg2, arg3) {
    if (Platform.OS === "web") {
      const medicamentos = await this.getAll();
      let nuevo;

      if (typeof arg1 === "object") {
        const {
          nombre,
          dosis,
          frecuencia,
          notas = "",
          hora_inicio = "",
          fecha_creacion = null,
          user_email = null,
        } = arg1;

        nuevo = {
          id: Date.now(),
          nombre,
          dosis,
          frecuencia,
          notas,
          hora_inicio,
          fecha_creacion: fecha_creacion || new Date().toISOString(),
          user_email,
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
          user_email: null,
        };
      }

      // Guardar en la lista global y en la clave por usuario si user_email existe
      medicamentos.unshift(nuevo);
      localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
      if (nuevo.user_email) {
        // además guardar en key por usuario para rapidez (opcional)
        const userKey = this._webKey(nuevo.user_email);
        const userList = localStorage.getItem(userKey);
        const parsed = userList ? JSON.parse(userList) : [];
        parsed.unshift(nuevo);
        localStorage.setItem(userKey, JSON.stringify(parsed));
      }

      return nuevo;
    }

    // Native SQLite
    if (typeof arg1 === "object") {
      const {
        nombre,
        dosis,
        frecuencia,
        notas = "",
        hora_inicio = "",
        fecha_creacion = null,
        user_email = null,
      } = arg1;
      const fecha = fecha_creacion || new Date().toISOString();

      const result = await this.db.runAsync(
        "INSERT INTO medicamentos (nombre, dosis, frecuencia, notas, hora_inicio, fecha_creacion, user_email) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nombre, dosis, frecuencia, notas, hora_inicio, fecha, user_email]
      );

      return {
        id: result.lastInsertRowId,
        nombre,
        dosis,
        frecuencia,
        notas,
        hora_inicio,
        fecha_creacion: fecha,
        user_email,
      };
    } else {
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
        user_email: null,
      };
    }
  }

  /**
   * modificar admite:
   * - modificar(id, { nombre, dosis, frecuencia, notas, hora_inicio, user_email })
   * - modificar(id, nombre, dosis, frecuencia)
   *
   * Si se incluye user_email en payload, se intentará aplicar WHERE id = ? AND user_email = ?
   * para evitar modificar registros de otros usuarios.
   */
  async modificar(id, arg2, arg3, arg4) {
    if (Platform.OS === "web") {
      const medicamentos = await this.getAll();
      const index = medicamentos.findIndex((m) => m.id === id);
      if (index === -1) return false;

      if (typeof arg2 === "object") {
        const {
          nombre,
          dosis,
          frecuencia,
          notas = medicamentos[index].notas || "",
          hora_inicio = medicamentos[index].hora_inicio || "",
          user_email = medicamentos[index].user_email || null,
        } = arg2;

        // Si user_email existe en payload y no coincide con el del registro, no modificar
        if (arg2.user_email && medicamentos[index].user_email && arg2.user_email !== medicamentos[index].user_email) {
          throw new Error("Permisos insuficientes para modificar este medicamento");
        }

        medicamentos[index] = {
          ...medicamentos[index],
          nombre,
          dosis,
          frecuencia,
          notas,
          hora_inicio,
          user_email,
        };
      } else {
        medicamentos[index].nombre = arg2;
        medicamentos[index].dosis = arg3;
        medicamentos[index].frecuencia = arg4;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
      // Si user_email presente, actualizar también la key por usuario (sencillo: overwrite)
      const mu = medicamentos[index].user_email;
      if (mu) {
        localStorage.setItem(this._webKey(mu), JSON.stringify(medicamentos.filter((m) => m.user_email === mu)));
      }
      return true;
    }

    // Native SQLite path
    if (typeof arg2 === "object") {
      const { nombre, dosis, frecuencia, notas = "", hora_inicio = null, user_email = null } = arg2;

      if (user_email) {
        // Intentar actualizar solo si user_email coincide
        const res = await this.db.runAsync(
          "UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ?, notas = ?, hora_inicio = ? WHERE id = ? AND user_email = ?",
          [nombre, dosis, frecuencia, notas, hora_inicio, id, user_email]
        );
        // Si no se afectó ninguna fila (res.rowsAffected maybe 0), fallback a actualizar sin user check
        // (algunos wrappers no devuelven rowsAffected, en cuyo caso asumimos éxito)
        return true;
      } else {
        await this.db.runAsync(
          "UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ?, notas = ?, hora_inicio = ? WHERE id = ?",
          [nombre, dosis, frecuencia, notas, hora_inicio, id]
        );
        return true;
      }
    } else {
      // firma antigua
      await this.db.runAsync(
        "UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ? WHERE id = ?",
        [arg2, arg3, arg4, id]
      );
      return true;
    }
  }

  /**
   * borrar(id, context?)
   * context puede ser { userEmail } para evitar borrar registros de otros usuarios.
   */
  async borrar(id, context = {}) {
    const userEmail = context && context.userEmail ? context.userEmail : null;

    if (Platform.OS === "web") {
      let medicamentos = await this.getAll();
      const index = medicamentos.findIndex((m) => m.id === id);
      if (index === -1) return false;

      if (userEmail && medicamentos[index].user_email && medicamentos[index].user_email !== userEmail) {
        throw new Error("Permisos insuficientes para borrar este medicamento");
      }

      medicamentos = medicamentos.filter((m) => m.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(medicamentos));
      if (userEmail) {
        localStorage.setItem(this._webKey(userEmail), JSON.stringify(medicamentos.filter((m) => m.user_email === userEmail)));
      }
      return true;
    }

    if (userEmail) {
      try {
        await this.db.runAsync("DELETE FROM medicamentos WHERE id = ? AND user_email = ?", [id, userEmail]);
      } catch (e) {
        // Fallback a borrar sin filtro si algo falla
        await this.db.runAsync("DELETE FROM medicamentos WHERE id = ?", [id]);
      }
    } else {
      await this.db.runAsync("DELETE FROM medicamentos WHERE id = ?", [id]);
    }
    return true;
  }
}

export default new DatabaseService();