import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { MedicamentoController } from "../controllers/MedicamentoController";

const controller = new MedicamentoController();

export default function PantallaEditarMedicamento({ route, navigation }) {
  const { medicamento } = route.params || {};

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState(""); 
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");

  // Modal date picker (sin dependencia nativa)
  const [showDateModal, setShowDateModal] = useState(false);
  const [fechaDate, setFechaDate] = useState(new Date());
  const [fechaTemp, setFechaTemp] = useState(new Date());

  // Ajuste de padding para Android para evitar superposición con la barra superior
  const androidTopPadding = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 8 : 0;

  useEffect(() => {
    if (medicamento) {
      setNombre(medicamento.nombre || "");
      setDosis(medicamento.dosis || "");
      setFrecuencia(medicamento.frecuencia || "");

      // Valores añadidos: notas, horaInicio, fechaCreacion (se muestran como "fechaInicio")
      setNotas(medicamento.notas || "");
      setHoraInicio(medicamento.horaInicio || medicamento.hora_inicio || "");

      const rawFecha = medicamento.fechaCreacion || medicamento.fecha_creacion || null;
      if (rawFecha) {
        const parsed = new Date(rawFecha);
        if (!isNaN(parsed)) {
          setFechaDate(parsed);
          setFechaTemp(parsed);
          setFechaInicio(formatDate(parsed));
        } else {
          // si viene como string legible
          setFechaInicio(String(rawFecha));
        }
      } else {
        setFechaDate(new Date());
        setFechaTemp(new Date());
        setFechaInicio("");
      }
    }
  }, [medicamento]);

  // Inicializar DB por si acaso
  useEffect(() => {
    const init = async () => {
      await controller.initialize();
    };
    init();
  }, []);

  // ===========================
  //       UPDATE en SQLite
  // ===========================
  async function guardarCambios() {
    if (!nombre || !dosis || !frecuencia) {
      Alert.alert("Error", "Todos los campos obligatorios deben llenarse");
      return;
    }

    try {
      await controller.initialize();

      // Editar medicamento: la implementación del controller acepta notas y horaInicio
      await controller.editarMedicamento(
        medicamento.id,
        nombre.trim(),
        dosis.trim(),
        frecuencia.trim(),
        notas.trim(),
        horaInicio.trim()
      );

      Alert.alert("Completado", "El medicamento ha sido actualizado.");
      // Volver y forzar recarga si la pantalla anterior lo gestiona por params / listeners
      navigation.navigate("PantallaMisMedicinas");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  // ===========================
  //        DELETE en SQLite
  // ===========================
  function eliminarMedicamento() {
    Alert.alert(
      "Eliminar",
      "¿Seguro que deseas eliminar este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await controller.initialize();
              await controller.eliminarMedicamento(medicamento.id);

              Alert.alert("Eliminado", "El medicamento ha sido borrado.");
              navigation.navigate("PantallaMisMedicinas");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  }

  // ---------------- Date modal helpers ----------------
  function formatDate(date) {
    try {
      return date.toLocaleDateString();
    } catch {
      const d = date;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    }
  }

  function openDatePicker() {
    setFechaTemp(fechaDate || new Date());
    setShowDateModal(true);
  }

  function changeTempDays(days) {
    const t = new Date(fechaTemp);
    t.setDate(t.getDate() + days);
    setFechaTemp(t);
  }

  function selectTempDate() {
    setFechaDate(fechaTemp);
    setFechaInicio(formatDate(fechaTemp));
    setShowDateModal(false);
  }

  function clearFecha() {
    setFechaDate(new Date());
    setFechaInicio("");
    setShowDateModal(false);
  }

  return (
    // SafeAreaView para iOS notch + padding extra en Android usando StatusBar.currentHeight
    <SafeAreaView style={[styles.safeArea, { paddingTop: androidTopPadding }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EDITAR MEDICAMENTO</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* FORMULARIO */}
        <TextInput
          style={styles.input}
          placeholder="Nombre del medicamento"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Dosis (ej. 50 mg)"
          value={dosis}
          onChangeText={setDosis}
        />

        <TextInput
          style={styles.input}
          placeholder="Frecuencia"
          value={frecuencia}
          onChangeText={setFrecuencia}
        />

        <TextInput
          style={styles.input}
          placeholder="Notas adicionales"
          value={notas}
          onChangeText={setNotas}
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
            <MaterialIcons name="date-range" size={20} color="#2D8BFF" />
            <Text style={[styles.dateInput, { marginLeft: 10 }]}>
              {fechaInicio ? fechaInicio : "Fecha de inicio"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dateButton}>
            <Ionicons name="time-outline" size={20} color="#2D8BFF" />
            <TextInput
              style={styles.dateInput}
              placeholder="Hora de inicio (HH:MM)"
              value={horaInicio}
              onChangeText={setHoraInicio}
            />
          </View>
        </View>

        {/* Modal propio para seleccionar fecha (sin dependencia nativa) */}
        <Modal visible={showDateModal} transparent animationType="fade" onRequestClose={() => setShowDateModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar fecha</Text>

              <View style={styles.modalDateRow}>
                <TouchableOpacity style={styles.arrowBtn} onPress={() => changeTempDays(-1)}>
                  <Text style={styles.arrowText}>‹</Text>
                </TouchableOpacity>

                <View style={styles.modalDateDisplay}>
                  <Text style={styles.modalDateText}>{formatDate(fechaTemp)}</Text>
                </View>

                <TouchableOpacity style={styles.arrowBtn} onPress={() => changeTempDays(1)}>
                  <Text style={styles.arrowText}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setFechaTemp(new Date()); }}>
                  <Text style={styles.modalBtnText}>Hoy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalBtn} onPress={() => { const t = new Date(); t.setDate(t.getDate() + 1); setFechaTemp(t); }}>
                  <Text style={styles.modalBtnText}>Mañana</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={selectTempDate}>
                  <Text style={[styles.modalBtnText, styles.modalBtnPrimaryText]}>Seleccionar</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.modalClose} onPress={() => setShowDateModal(false)}>
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* BOTÓN GUARDAR CAMBIOS */}
        <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
          <Text style={styles.btnText}>GUARDAR CAMBIOS</Text>
        </TouchableOpacity>

        {/* BOTÓN ELIMINAR */}
        <TouchableOpacity style={styles.btnEliminar} onPress={eliminarMedicamento}>
          <Text style={styles.btnEliminarText}>ELIMINAR MEDICAMENTO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============= ESTILOS =============

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F2FF",
  },
  container: {
    padding: 20,
    backgroundColor: "#E8F2FF",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  dateInput: {
    marginLeft: 10,
    flex: 1,
    color: "#333",
  },
  btnGuardar: {
    backgroundColor: "#00C851",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 25,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  btnEliminar: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },
  btnEliminarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Modal styles (mismo estilo que PantallaAgregarMedicamento) */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalDateRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 24,
    color: "#333",
  },
  modalDateDisplay: {
    flex: 1,
    marginHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  modalDateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
  },
  modalBtnPrimary: {
    backgroundColor: "#2D8BFF",
  },
  modalBtnText: {
    color: "#333",
    fontWeight: "700",
  },
  modalBtnPrimaryText: {
    color: "white",
  },
  modalClose: {
    marginTop: 6,
    paddingVertical: 6,
  },
  modalCloseText: {
    color: "#888",
  },
});