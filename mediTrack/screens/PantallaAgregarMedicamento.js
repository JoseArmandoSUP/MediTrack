import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


export default function PantallaAgregarMedicamento({ navigation }) {
  // Estados
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");

  const [guardado, setGuardado] = useState(false);

  function guardarMedicamento() {
    if (!nombre || !dosis || !frecuencia || !fechaInicio || !horaInicio) {
      alert("Por favor llena todos los campos obligatorios");
      return;
    }

    setGuardado(true);
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

      {/* Escanear receta */}
      <TouchableOpacity style={styles.scanBox}>
        <Ionicons name="scan-outline" size={40} color="#2D8BFF" />
        <Text style={styles.scanText}>ESCANEAR RECETA MÉDICA</Text>
      </TouchableOpacity>

      {/* FORMULARIO */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del medicamento"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Dosis eje. 50 mg"
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

      {/* FECHA Y HORA */}
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
      </View>

      {/* CUADRO DE INFORMACIÓN GUARDADA */}
      {guardado && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Información Guardada</Text>
          <Text style={styles.infoText}>Medicamento: {nombre}</Text>
          <Text style={styles.infoText}>Dosis: {dosis}</Text>
          <Text style={styles.infoText}>Frecuencia: {frecuencia}</Text>
          <Text style={styles.infoText}>Fecha de inicio: {fechaInicio}</Text>
          <Text style={styles.infoText}>Hora de inicio: {horaInicio}</Text>
          <Text style={styles.infoText}>Notas: {notas}</Text>
        </View>
      )}

      {/* BOTÓN VERDE */}
      <TouchableOpacity style={styles.btnAgregar} onPress={guardarMedicamento}>
        <Text style={styles.btnText}>AGREGAR MEDICAMENTO</Text>
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
  scanBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  scanText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
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
  infoBox: {
    backgroundColor: "#2D8BFF",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  infoTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },
  infoText: {
    color: "#fff",
    marginBottom: 5,
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