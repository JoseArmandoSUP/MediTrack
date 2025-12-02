export class Usuario {
    constructor(id, nombre, correo, contraseña) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.contraseña = contraseña;
    }

    static validar(nombre, correo, contraseña) {

        if (!nombre || nombre.trim().length === 0) {
            throw new Error("El nombre no puede estar vacío");
        }

        if (!correo || correo.trim().length === 0) {
            throw new Error("El correo no puede estar vacío");
        }

        // Validar correo
        const regexCorreo = /\S+@\S+\.\S+/;
        if (!regexCorreo.test(correo)) {
            throw new Error("El correo no es válido");
        }

        if (!contraseña || contraseña.trim().length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        return true;
    }
}