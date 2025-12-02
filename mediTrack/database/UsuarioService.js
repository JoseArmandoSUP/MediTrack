import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class UsuarioService {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.storageKey = "usuarios";
    }

    async initialize() {
        if (this.initialized) return;
        this.initialized = true;

        if (Platform.OS === "web") {
            console.log("Usando LocalStorage para usuarios (WEB)");
            return;
        }

        console.log("Usando SQLite para usuarios");
        this.db = await SQLite.openDatabaseAsync("meditrack.db");

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL UNIQUE,
                contraseña TEXT NOT NULL
            );
        `);
    }

    async registrar(nombre, correo, contraseña) {

        if (Platform.OS === "web") {
            let usuarios = await this.getAll();
            const nuevo = {id: Date.now(), nombre, correo, contraseña};
            usuarios.push(nuevo);
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return nuevo;
        }

        const result = await this.db.runAsync(
            "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)",
            [nombre, correo, contraseña]
        );

        return {
            id: result.lastInsertRowId,
            nombre,
            correo,
            contraseña
        };
    }

    async getAll() {
        if (Platform.OS === "web") {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        }

        return await this.db.getAllAsync("SELECT * FROM usuarios");
    }

    async login(correo, contraseña) {

        if (Platform.OS === "web") {
            const usuarios = await this.getAll();
            return usuarios.find(u => u.correo === correo && u.contraseña === contraseña) || null;
        }

        const result = await this.db.getAllAsync(
            "SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?",
            [correo, contraseña]
        );

        return result.length > 0 ? result[0] : null;
    }

    async obtenerUsuarioPorCorreo(correo) {
    await this.initialize(); // asegura DB

    if (Platform.OS === "web") {
        const usuarios = await this.getAll();
        return usuarios.find(u => u.correo === correo) || null;
    }

    const res = await this.db.getAllAsync(
        "SELECT * FROM usuarios WHERE correo = ?",
        [correo]
    );

    return res.length > 0 ? res[0] : null;
}

async cambiarContraseña(correo, nuevaPass) {
    await this.initialize();

        if (Platform.OS === "web") {
            let usuarios = await this.getAll();
            usuarios = usuarios.map(u =>
                u.correo === correo ? { ...u, contraseña: nuevaPass } : u
            );
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return;
        }

        await this.db.runAsync(
            "UPDATE usuarios SET contraseña = ? WHERE correo = ?",
            [nuevaPass, correo]
        );
    }
}

export default new UsuarioService();
