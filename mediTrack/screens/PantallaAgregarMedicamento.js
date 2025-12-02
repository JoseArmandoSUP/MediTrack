import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { MedicamentoController } from "../controllers/MedicamentoController";

const controller = new MedicamentoController();

export default function PantallaAgregarMedicamento({ navigation }) {
  // Estados
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState("");
  const [fechaInicio, setFechaInicio] = useState(""); // string para mostrar
  const [horaInicio, setHoraInicio] = useState("");

  const [guardando, setGuardando] = useState(false);

  // Calendar modal states (sin dependencia nativa)
  const [showDateModal, setShowDateModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // month: 0-11
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ajuste de padding para Android y SafeArea para iOS/notch
  const androidTopPadding = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

  // Inicializar SQLite una sola vez
  useEffect(() => {
    const init = async () => {
      await controller.initialize();
    };
    init();
  }, []);

  // Formato legible para la fecha
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

  // Abrir selector de fecha (calendario)
  function openDatePicker() {
    const d = selectedDate || new Date();
    setCalendarMonth({ year: d.getFullYear(), month: d.getMonth() });
    setShowDateModal(true);
  }

  function prevMonth() {
    setCalendarMonth((cur) => {
      const m = cur.month - 1;
      if (m < 0) return { year: cur.year - 1, month: 11 };
      return { year: cur.year, month: m };
    });
  }

  function nextMonth() {
    setCalendarMonth((cur) => {
      const m = cur.month + 1;
      if (m > 11) return { year: cur.year + 1, month: 0 };
      return { year: cur.year, month: m };
    });
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function firstWeekdayOfMonth(year, month) {
    // returns 0 (Sunday) - 6 (Saturday)
    return new Date(year, month, 1).getDay();
  }

  function buildCalendar(year, month) {
    const days = [];
    const firstWeekday = firstWeekdayOfMonth(year, month);
    const totalDays = daysInMonth(year, month);

    // Fill leading empty cells
    for (let i = 0; i < firstWeekday; i++) {
      days.push(null);
    }
    // Fill days
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }

  function onSelectDay(dayDate) {
    setSelectedDate(dayDate);
    setFechaInicio(formatDate(dayDate));
    setShowDateModal(false);
  }

  function selectToday() {
    const today = new Date();
    setSelectedDate(today);
    setFechaInicio(formatDate(today));
    setShowDateModal(false);
  }

  function selectTomorrow() {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    setSelectedDate(t);
    setFechaInicio(formatDate(t));
    setShowDateModal(false);
  }

  // ---------------- Time input: simple raw input (allow digits and colon) ----------------
  function handleRawTimeInput(text) {
    // Allow only digits and colon, limit length to 5 (HH:MM)
    let filtered = text.replace(/[^0-9:]/g, "");
    if (filtered.length > 5) filtered = filtered.slice(0, 5);
    setHoraInicio(filtered);
  }

  async function guardarMedicamento() {
    if (!nombre || !dosis || !frecuencia) {
      Alert.alert("Campos incompletos", "Completa nombre, dosis y frecuencia");
      return;
    }

    // If horaInicio provided, validate pattern HH:MM (optional)
    if (horaInicio && !/^([01]?\d|2[0-3]):[0-5]\d$/.test(horaInicio)) {
      Alert.alert("Hora inválida", "Si indicas hora, usa el formato HH:MM (24h) — por ejemplo 07:30");
      return;
    }

    try {
      setGuardando(true);

      // Preparar valores para la creación (fecha en ISO si se escogió)
      const fechaCreacionISO = selectedDate ? selectedDate.toISOString() : null;

      // INSERT en SQLite usando MVC - ahora pasando notas, horaInicio y fechaCreacion
      await controller.crearMedicamento(
        nombre.trim(),
        dosis.trim(),
        frecuencia.trim(),
        notas.trim(),
        horaInicio.trim(),
        fechaCreacionISO
      );

      Alert.alert("Guardado", "Medicamento agregado correctamente");

      // Limpiar campos
      setNombre("");
      setDosis("");
      setFrecuencia("");
      setNotas("");
      setFechaInicio("");
      setHoraInicio("");
      setSelectedDate(new Date());
      setCalendarMonth({ year: new Date().getFullYear(), month: new Date().getMonth() });

      // Regresar automáticamente
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setGuardando(false);
    }
  }

  // Calendar rendering helpers
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const calendarDays = buildCalendar(calendarMonth.year, calendarMonth.month);

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: androidTopPadding }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AGREGAR MEDICAMENTO +</Text>
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
          placeholder="Dosis (eje. 50 mg)"
          value={dosis}
          onChangeText={setDosis}
        />

        <TextInput
          style={styles.input}
          placeholder="Frecuencia (eje. cada 8 horas)"
          value={frecuencia}
          onChangeText={setFrecuencia}
        />

        <TextInput
          style={styles.input}
          placeholder="Notas adicionales"
          value={notas}
          onChangeText={setNotas}
        />

        {/* FECHA Y HORA */}
        <View style={styles.row}>
          {/* Fecha manejada con calendario */}
          <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
            <MaterialIcons name="date-range" size={20} color="#2D8BFF" />
            <Text style={styles.dateText}>
              {fechaInicio ? fechaInicio : "Fecha de inicio"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dateButton}>
            <Ionicons name="time-outline" size={20} color="#2D8BFF" />
            <TextInput
              style={styles.dateInput}
              placeholder="HH:MM"
              value={horaInicio}
              onChangeText={handleRawTimeInput}
              keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
              maxLength={5}
            />
          </View>
        </View>

        {/* Modal de calendario */}
        <Modal visible={showDateModal} transparent animationType="fade" onRequestClose={() => setShowDateModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCalendar}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={prevMonth} style={styles.calNav}>
                  <Text style={styles.calNavText}>‹</Text>
                </TouchableOpacity>

                <Text style={styles.calendarTitle}>
                  {new Date(calendarMonth.year, calendarMonth.month).toLocaleString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>

                <TouchableOpacity onPress={nextMonth} style={styles.calNav}>
                  <Text style={styles.calNavText}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekDaysRow}>
                {weekDays.map((w) => (
                  <Text key={w} style={styles.weekDay}>
                    {w}
                  </Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {calendarDays.map((day, idx) => {
                  const isSelected =
                    day &&
                    selectedDate &&
                    day.getFullYear() === selectedDate.getFullYear() &&
                    day.getMonth() === selectedDate.getMonth() &&
                    day.getDate() === selectedDate.getDate();

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.dayCell,
                        isSelected ? styles.dayCellSelected : null,
                        !day ? styles.dayCellEmpty : null,
                      ]}
                      disabled={!day}
                      onPress={() => day && onSelectDay(day)}
                    >
                      <Text style={[styles.dayText, isSelected ? styles.dayTextSelected : null]}>
                        {day ? day.getDate() : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalBtn} onPress={selectToday}>
                  <Text style={styles.modalBtnText}>Hoy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalBtn} onPress={selectTomorrow}>
                  <Text style={styles.modalBtnText}>Mañana</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={() => { setShowDateModal(false); }}>
                  <Text style={[styles.modalBtnText, styles.modalBtnPrimaryText]}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* BOTÓN VERDE */}
        <TouchableOpacity style={styles.btnAgregar} onPress={guardarMedicamento} disabled={guardando}>
          <Text style={styles.btnText}>{guardando ? "Guardando..." : "AGREGAR MEDICAMENTO"}</Text>
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ESTILOS
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
    marginBottom: 20,
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
  dateText: {
    marginLeft: 10,
    color: "#333",
    flex: 1,
  },
  dateInput: {
    marginLeft: 10,
    flex: 1,
  },
  btnAgregar: {
    backgroundColor: "#00C851",
    padding: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },

  /* Modal / Calendar styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContentCalendar: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  calNav: {
    padding: 6,
  },
  calNavText: {
    fontSize: 22,
    color: "#2D8BFF",
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  weekDay: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: "#666",
    fontWeight: "700",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  dayCellEmpty: {
    opacity: 0,
  },
  dayCellSelected: {
    backgroundColor: "#2D8BFF",
    borderRadius: 8,
  },
  dayText: {
    color: "#333",
  },
  dayTextSelected: {
    color: "white",
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 8,
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
});