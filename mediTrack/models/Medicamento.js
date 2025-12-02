export class Medicamento {
    constructor(id, nombre, dosis, frecuencia, fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.dosis = dosis;
        this.frecuencia = frecuencia;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
    }

    // Validaciones del modelo
    static validar(nombre, dosis, frecuencia) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        if (nombre.length > 50) {
            throw new Error("El nombre no puede tener más de 50 caracteres");
        }

        if (!dosis || dosis.trim().length === 0) {
            throw new Error("La dosis no puede estar vacía");
        }
        if (dosis.length > 50) {
            throw new Error("La dosis no puede tener más de 50 caracteres");
        }

        if (!frecuencia || frecuencia.trim().length === 0) {
            throw new Error("La frecuencia no puede estar vacía");
        }

        return true;
    }
}
