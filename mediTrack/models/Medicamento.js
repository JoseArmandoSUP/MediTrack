export class Medicamento {
    constructor(id, nombre, dosis, frecuencia, fechaCreacion, notas = "", horaInicio = "") {
        this.id = id;
        this.nombre = nombre;
        this.dosis = dosis;
        this.frecuencia = frecuencia;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
        this.notas = notas || "";
        this.horaInicio = horaInicio || "";
    }

    // Validaciones del modelo
    static validar(nombre, dosis, frecuencia, notas = "", horaInicio = "") {
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
        if (frecuencia.length > 100) {
            throw new Error("La frecuencia no puede tener más de 100 caracteres");
        }

        // notas opcionales: límite razonable
        if (notas && notas.length > 1000) {
            throw new Error("Las notas no pueden exceder 1000 caracteres");
        }

        // horaInicio opcional: si se proporciona, validar formato HH:MM (24h) o H:MM
        if (horaInicio && horaInicio.trim().length > 0) {
            const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
            if (!timeRegex.test(horaInicio.trim())) {
                throw new Error("La hora de inicio debe tener el formato HH:MM (24 horas)");
            }
        }

        return true;
    }
}