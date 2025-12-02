import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { MedicamentoController } from "../controllers/MedicamentoController";

const controller = new MedicamentoController();

export default function PantallaAgregarMedicamento({ navigation }) {
  // Estados
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");

  const [guardando, setGuardando] = useState(false);

  // Inicializar SQLite una sola vez
  useEffect(() => {
    const init = async () => {
      await controller.initialize();
    };
    init();
  }, []);

  async function guardarMedicamento() {
    if (!nombre || !dosis || !frecuencia) {
      Alert.alert("Campos incompletos", "Completa nombre, dosis y frecuencia");
      return;
    }

    try {
      setGuardando(true);

      // INSERT en SQLite usando MVC
      await controller.crearMedicamento(nombre, dosis, frecuencia);

      Alert.alert("Guardado", "Medicamento agregado correctamente");

      // Limpiar campos
      setNombre("");
      setDosis("");
      setFrecuencia("");

      // Regresar automáticamente
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
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

      {/*<TextInput
        style={styles.input}
        placeholder="Notas adicionales"
        value={notas}
        onChangeText={setNotas}
      />

      FECHA Y HORA 
      <View style={styles.row}>
        <TouchableOpacity style={styles.dateButton}>
          <MaterialIcons name="date-range" size={20} color="#2D8BFF" />
          <TextInput
            style={styles.dateInput}
            placeholder="Fecha de inicio"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateButton}>
          <Ionicons name="time-outline" size={20} color="#2D8BFF" />
          <TextInput
            style={styles.dateInput}
            placeholder="Hora de inicio"
            value={horaInicio}
            onChangeText={setHoraInicio}
          />
        </TouchableOpacity>
      </View>*/}

      {/* BOTÓN VERDE */}
      <TouchableOpacity
        style={styles.btnAgregar}
        onPress={guardarMedicamento}
        disabled={guardando}
      >
        <Text style={styles.btnText}>
          {guardando ? "Guardando..." : "AGREGAR MEDICAMENTO"}
        </Text>
        <Ionicons name="add-circle-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
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
});
