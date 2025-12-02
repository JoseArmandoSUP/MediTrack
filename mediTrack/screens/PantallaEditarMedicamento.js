import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Text, Alert, StyleSheet } from "react-native";
import { updateMedicamento, deleteMedicamento } from "../database/database";

export default function PantallaEditarMedicamento({ route, navigation }) {
  const { medicamento } = route.params;

  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");

  useEffect(() => {
    if (medicamento) {
      setNombre(medicamento.nombre);
      setDosis(medicamento.dosis);
      setFrecuencia(medicamento.frecuencia);
      setNotas(medicamento.notas);
      setFechaInicio(medicamento.fechaInicio);
      setHoraInicio(medicamento.horaInicio);
    }
  }, []);

  function guardarCambios() {
    const medActualizado = { id: medicamento.id, nombre, dosis, frecuencia, notas, fechaInicio, horaInicio };
    updateMedicamento(medActualizado, () => {
      Alert.alert("Éxito", "Medicamento actualizado");
      navigation.goBack();
    });
  }

  function eliminar() {
    Alert.alert("Eliminar", "¿Deseas eliminar este medicamento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteMedicamento(medicamento.id, () => {
            Alert.alert("Eliminado", "Medicamento eliminado");
            navigation.goBack();
          });
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Dosis" value={dosis} onChangeText={setDosis} />
      <TextInput style={styles.input} placeholder="Frecuencia" value={frecuencia} onChangeText={setFrecuencia} />
      <TextInput style={styles.input} placeholder="Notas" value={notas} onChangeText={setNotas} />
      <TextInput style={styles.input} placeholder="Fecha inicio" value={fechaInicio} onChangeText={setFechaInicio} />
      <TextInput style={styles.input} placeholder="Hora inicio" value={horaInicio} onChangeText={setHoraInicio} />

      <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
        <Text style={styles.btnText}>GUARDAR CAMBIOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnEliminar} onPress={eliminar}>
        <Text style={styles.btnEliminarText}>ELIMINAR MEDICAMENTO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F2FF",
    flexGrow: 1,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
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
});
