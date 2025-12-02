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

    async obtenerMedicamentos() {
        try {
            const data = await DatabaseService.getAll();
            return data.map(m => 
                new Medicamento(
                    m.id, 
                    m.nombre, 
                    m.dosis, 
                    m.frecuencia, 
                    m.fecha_creacion
                )
            );
        } catch (error) {
            console.error("Error al obtener medicamentos:", error);
            throw new Error("No se pudieron cargar los medicamentos");
        }
    }

    async crearMedicamento(nombre, dosis, frecuencia) {
        try {
            Medicamento.validar(nombre, dosis, frecuencia);
            const nuevo = await DatabaseService.add(nombre, dosis, frecuencia);
            this.notifyListeners();
            return new Medicamento(nuevo.id, nuevo.nombre, nuevo.dosis, nuevo.frecuencia, nuevo.fecha_creacion);
        } catch (error) {
            console.error("Error al crear medicamento:", error);
            throw error;
        }
    }

    async editarMedicamento(id, nombre, dosis, frecuencia) {
        try {
            Medicamento.validar(nombre, dosis, frecuencia);
            await DatabaseService.modificar(id, nombre, dosis, frecuencia);
            this.notifyListeners();
        } catch (error) {
            console.error("Error al editar medicamento:", error);
            throw error;
        }
    }

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
