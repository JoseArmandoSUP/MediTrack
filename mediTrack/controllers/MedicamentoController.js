import { Medicamento } from "../models/Medicamento";
import DatabaseService from "../database/DatabaseService";

export class MedicamentoController {
    constructor() {
        this.listeners = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await DatabaseService.initialize();
        this.initialized = true;
    }

    /**
     * Obtener todos los medicamentos.
     * Ahora mapea también notas, fecha_creacion y hora_inicio (si existen en la DB).
     */
    async obtenerMedicamentos() {
        try {
            const data = await DatabaseService.getAll();
            return data.map(m => 
                new Medicamento(
                    m.id, 
                    m.nombre, 
                    m.dosis, 
                    m.frecuencia, 
                    // nueva propiedad fechaCreacion (se espera m.fecha_creacion en la DB)
                    m.fecha_creacion || m.fechaCreacion || null,
                    // nueva propiedad notas
                    m.notas || m.descripcion || "",
                    // nueva propiedad horaInicio (se espera m.hora_inicio en la DB)
                    m.hora_inicio || m.horaInicio || ""
                )
            );
        } catch (error) {
            console.error("Error al obtener medicamentos:", error);
            throw new Error("No se pudieron cargar los medicamentos");
        }
    }

    /**
     * Crear medicamento.
     * Ahora recibe (opcional) notas y horaInicio.
     * La fecha de creación se asigna automáticamente si no se proporciona.
     *
     * Nota: DatabaseService.add debe actualizarse para aceptar y persistir estos campos
     * (notas, fecha_creacion, hora_inicio). Si tu DB usa nombres distintos, ajusta aquí.
     */
    async crearMedicamento(nombre, dosis, frecuencia, notas = "", horaInicio = "", fechaCreacion = null) {
        try {
            // Validación en el modelo (si Medicamento.validar soporta nuevos campos, pásalos)
            // Si tu modelo no valida notas/hora, no pasa nada; ajusta Medicamento.validar si quieres validarlos.
            Medicamento.validar(nombre, dosis, frecuencia);

            const fecha = fechaCreacion || new Date().toISOString();

            // Llamada a DatabaseService: asegúrate de actualizar su firma para aceptar estos campos
            const nuevo = await DatabaseService.add({
                nombre,
                dosis,
                frecuencia,
                notas,
                hora_inicio: horaInicio,
                fecha_creacion: fecha,
            });

            this.notifyListeners();

            return new Medicamento(
                nuevo.id,
                nuevo.nombre,
                nuevo.dosis,
                nuevo.frecuencia,
                nuevo.fecha_creacion || fecha,
                nuevo.notas || notas,
                nuevo.hora_inicio || horaInicio
            );
        } catch (error) {
            console.error("Error al crear medicamento:", error);
            throw error;
        }
    }

    /**
     * Editar medicamento existente.
     * Ahora acepta notas y horaInicio para actualizar.
     * No se modifica fecha_creacion por defecto.
     */
    async editarMedicamento(id, nombre, dosis, frecuencia, notas = "", horaInicio = "") {
        try {
            Medicamento.validar(nombre, dosis, frecuencia);

            // DatabaseService.modificar debe aceptar los nuevos campos
            await DatabaseService.modificar(id, {
                nombre,
                dosis,
                frecuencia,
                notas,
                hora_inicio: horaInicio,
            });

            this.notifyListeners();
        } catch (error) {
            console.error("Error al editar medicamento:", error);
            throw error;
        }
    }

    /**
     * Eliminar medicamento (sin cambios).
     */
    async eliminarMedicamento(id) {
        try {
            await DatabaseService.borrar(id);
            this.notifyListeners();
        } catch (error) {
            console.error("Error al eliminar medicamento:", error);
            throw error;
        }
    }

    addListener(cb) {
        this.listeners.push(cb);
    }

    removeListener(cb) {
        this.listeners = this.listeners.filter(l => l !== cb);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb());
    }
}