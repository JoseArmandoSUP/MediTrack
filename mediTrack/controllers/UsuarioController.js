import UsuarioService from "../database/UsuarioService";
import { Usuario } from "../models/Usuario";

export class UsuarioController {

    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await UsuarioService.initialize();
        this.initialized = true;
    }

    async registrar(nombre, correo, contraseña) {
        try {
            Usuario.validar(nombre, correo, contraseña);
            await this.initialize();

            const nuevo = await UsuarioService.registrar(nombre, correo, contraseña);
            return new Usuario(nuevo.id, nuevo.nombre, nuevo.correo, nuevo.contraseña);

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    }

    async login(correo, contraseña) {
        try {
            await this.initialize();
            const encontrado = await UsuarioService.login(correo, contraseña);

            if (!encontrado) {
                throw new Error("Correo o contraseña incorrectos");
            }

            return new Usuario(
                encontrado.id,
                encontrado.nombre,
                encontrado.correo,
                encontrado.contraseña
            );

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    }

    obtenerUsuarioPorCorreo(correo) {
        return UsuarioService.obtenerUsuarioPorCorreo(correo);
    }

    cambiarContraseña(correo, nuevaPass) {
        return UsuarioService.cambiarContraseña(correo, nuevaPass);
    }


}
