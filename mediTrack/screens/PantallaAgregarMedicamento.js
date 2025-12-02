import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { insertMedicamento } from "../database/database";

export default function PantallaAgregarMedicamento({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");

  function guardarMedicamento() {
    if (!nombre || !dosis || !frecuencia || !fechaInicio || !horaInicio) {
      alert("Por favor llena todos los campos obligatorios");
      return;
    }

    const med = { nombre, dosis, frecuencia, notas, fechaInicio, horaInicio };

    insertMedicamento(med, (err) => {
      if (err) {
        alert("Error al guardar medicamento");
      } else {
        alert("Medicamento guardado");
        navigation.navigate("MisMedicamentos");
      }
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Dosis" value={dosis} onChangeText={setDosis} />
      <TextInput style={styles.input} placeholder="Frecuencia" value={frecuencia} onChangeText={setFrecuencia} />
      <TextInput style={styles.input} placeholder="Notas" value={notas} onChangeText={setNotas} />
      <TextInput style={styles.input} placeholder="Fecha inicio" value={fechaInicio} onChangeText={setFechaInicio} />
      <TextInput style={styles.input} placeholder="Hora inicio" value={horaInicio} onChangeText={setHoraInicio} />

      <TouchableOpacity style={styles.btnAgregar} onPress={guardarMedicamento}>
        <Text style={styles.btnText}>AGREGAR</Text>
        <Ionicons name="add-circle-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F9FF",
    flexGrow: 1,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingVertical: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
  },

  // TARJETA ESCANEAR
  scanBox: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  scanText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#2D8BFF",
  },

  // INPUTS
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    fontSize: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  dateButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "#D6E4FF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  dateInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
  },

  // INFO GUARDADA
  infoBox: {
    backgroundColor: "#2D8BFF",
    padding: 18,
    borderRadius: 18,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  infoTitle: {
    color: "#fff",
    fontWeight: "800",
    marginBottom: 12,
    fontSize: 17,
  },
  infoText: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 14,
  },

  // BOTÓN PRINCIPAL
  btnAgregar: {
    backgroundColor: "#00C851",
    paddingVertical: 16,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
    shadowColor: "#00C851",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginRight: 12,
  },
});
