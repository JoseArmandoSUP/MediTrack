import { Medicamento } from "../models/Medicamento";
import DatabaseService from "../database/DatabaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class MedicamentoController {
    constructor() {
        this.listeners = [];
        this.initialized = false;
        this.currentUserEmail = null;
        this.token = null;
    }

    async initialize() {
        if (this.initialized) return;
        await DatabaseService.initialize();
        await this._setSessionFromStorage();
        this.initialized = true;
    }

    async _setSessionFromStorage() {
        try {
            const email = await AsyncStorage.getItem("@user_email");
            const token = await AsyncStorage.getItem("@app_token");
            if (email) this.currentUserEmail = email;
            if (token) this.token = token;
        } catch (err) {
            console.warn("No se pudo leer la sesión desde AsyncStorage:", err);
        }
    }

    async setSession(email, token) {
        try {
            if (email) {
                this.currentUserEmail = email;
                await AsyncStorage.setItem("@user_email", email);
            }
            if (token) {
                this.token = token;
                await AsyncStorage.setItem("@app_token", token);
            }
        } catch (err) {
            console.warn("Error guardando sesión en AsyncStorage:", err);
        }
    }

    async clearSession() {
        try {
            this.currentUserEmail = null;
            this.token = null;
            await AsyncStorage.removeItem("@user_email");
            await AsyncStorage.removeItem("@app_token");
        } catch (err) {
            console.warn("Error limpiando sesión en AsyncStorage:", err);
        }
    }

    /**
     * Obtener todos los medicamentos.
     * Si existe sesión (currentUserEmail) se intenta pasar como filtro al DatabaseService.
     */
    async obtenerMedicamentos() {
        try {
            let data;
            // Intentar pasar filtro por usuario si DatabaseService soporta parámetros de filtro.
            try {
                if (this.currentUserEmail) {
                    // DatabaseService.getAll puede aceptar un objeto filtro; si no lo acepta,
                    // este call debería lanzar y caer al siguiente fallback.
                    data = await DatabaseService.getAll({ userEmail: this.currentUserEmail });
                } else {
                    data = await DatabaseService.getAll();
                }
            } catch (e) {
                // Fallback: llamar sin filtros si la implementación de DatabaseService no acepta parámetros
                data = await DatabaseService.getAll();
            }

            return (data || []).map(m =>
                new Medicamento(
                    m.id,
                    m.nombre,
                    m.dosis,
                    m.frecuencia,
                    m.fecha_creacion || m.fechaCreacion || null,
                    m.notas || m.descripcion || "",
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
     * Se asocia al usuario en sesión si existe currentUserEmail.
     */
    async crearMedicamento(nombre, dosis, frecuencia, notas = "", horaInicio = "", fechaCreacion = null) {
        try {
            Medicamento.validar(nombre, dosis, frecuencia);

            const fecha = fechaCreacion || new Date().toISOString();

            const payload = {
                nombre,
                dosis,
                frecuencia,
                notas,
                hora_inicio: horaInicio,
                fecha_creacion: fecha,
            };

            if (this.currentUserEmail) {
                // Nombre de campo user_email en la BD; ajusta si tu DB usa otro nombre (ej. owner_email)
                payload.user_email = this.currentUserEmail;
            }

            // Si DatabaseService.add requiere token/headers, deberá adaptarse dentro de DatabaseService.
            const nuevo = await DatabaseService.add(payload);

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
     * Se intenta incluir verificación/atributo del usuario en la actualización si hay sesión.
     */
    async editarMedicamento(id, nombre, dosis, frecuencia, notas = "", horaInicio = "") {
        try {
            Medicamento.validar(nombre, dosis, frecuencia);

            const payload = {
                nombre,
                dosis,
                frecuencia,
                notas,
                hora_inicio: horaInicio,
            };

            if (this.currentUserEmail) {
                payload.user_email = this.currentUserEmail;
            }

            await DatabaseService.modificar(id, payload);

            this.notifyListeners();
        } catch (error) {
            console.error("Error al editar medicamento:", error);
            throw error;
        }
    }

    /**
     * Eliminar medicamento.
     * Si existe sesión, se intenta pasar la info del usuario para que la capa de datos valide permisos.
     */
    async eliminarMedicamento(id) {
        try {
            // Si DatabaseService.borrar soporta pasar contexto/usuario, intenta usarlo.
            if (this.currentUserEmail) {
                try {
                    await DatabaseService.borrar(id, { userEmail: this.currentUserEmail });
                } catch (e) {
                    // Fallback a borrar sin contexto si no soporta el segundo parámetro
                    await DatabaseService.borrar(id);
                }
            } else {
                await DatabaseService.borrar(id);
            }

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
        this.listeners.forEach(cb => {
            try {
                cb();
            } catch (e) {
                console.warn("Listener lanzó error:", e);
            }
        });
    }
}