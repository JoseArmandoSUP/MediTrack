export class Medicamento {
    constructor(id, nombre, dosis, frecuencia, fechaCreacion, notas = "", horaInicio = "", userEmail = null) {
        this.id = id;
        this.nombre = nombre;
        this.dosis = dosis;
        this.frecuencia = frecuencia;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
        this.notas = notas || "";
        this.horaInicio = horaInicio || "";
        this.userEmail = userEmail || null;
    }

    // Validaciones del modelo
    static validar(nombre, dosis, frecuencia, notas = "", horaInicio = "", userEmail = null) {
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

        // userEmail opcional: si se proporciona, validar formato básico de email
        if (userEmail && userEmail.trim().length > 0) {
            const emailRe = /\S+@\S+\.\S+/;
            if (!emailRe.test(userEmail.trim())) {
                throw new Error("El email del usuario no tiene un formato válido");
            }
            if (userEmail.length > 254) {
                throw new Error("El email del usuario es demasiado largo");
            }
        }

        return true;
    }

    // Crea una instancia de Medicamento a partir de una fila/objeto de la DB
    // Acepta nombres de campos en snake_case o camelCase.
    static fromRow(row = {}) {
        if (!row) return null;
        const id = row.id ?? row.ID ?? null;
        const nombre = row.nombre ?? row.name ?? "";
        const dosis = row.dosis ?? row.dose ?? "";
        const frecuencia = row.frecuencia ?? row.frequency ?? "";
        const fechaCreacion = row.fecha_creacion ?? row.fechaCreacion ?? row.created_at ?? null;
        const notas = row.notas ?? row.descripcion ?? row.description ?? "";
        const horaInicio = row.hora_inicio ?? row.horaInicio ?? row.start_time ?? "";
        const userEmail = row.user_email ?? row.userEmail ?? null;

        return new Medicamento(id, nombre, dosis, frecuencia, fechaCreacion, notas, horaInicio, userEmail);
    }

    // Convierte la instancia a un objeto apto para persistir en DatabaseService
    toDBObject() {
        return {
            id: this.id,
            nombre: this.nombre,
            dosis: this.dosis,
            frecuencia: this.frecuencia,
            notas: this.notas,
            hora_inicio: this.horaInicio,
            fecha_creacion: this.fechaCreacion,
            user_email: this.userEmail,
        };
    }
}