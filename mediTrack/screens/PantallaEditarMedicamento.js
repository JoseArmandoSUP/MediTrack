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

export default function PantallaEditarMedicamento({ route, navigation }) {
  
  // Recibimos los datos del medicamento desde la pantalla anterior
  const { medicamento } = route.params || {};

  // Estados del formulario
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
    if (!nombre || !dosis || !frecuencia || !fechaInicio || !horaInicio) {
      Alert.alert("Error", "Todos los campos obligatorios deben llenarse");
      return;
    }

    Alert.alert("Cambios guardados", "El medicamento ha sido actualizado.");
    
    // Aquí después haremos el UPDATE en SQLite
    navigation.goBack();
  }

  function eliminarMedicamento() {
    Alert.alert(
      "Eliminar medicamento",
      "¿Seguro que deseas eliminar este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Luego haremos DELETE real en SQLite
            Alert.alert("Eliminado", "El medicamento ha sido borrado.");
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

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
        <View style={styles.dateButton}>
          <MaterialIcons name="date-range" size={20} color="#2D8BFF" />
          <TextInput
            style={styles.dateInput}
            placeholder="Fecha de inicio"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />
        </View>

        <View style={styles.dateButton}>
          <Ionicons name="time-outline" size={20} color="#2D8BFF" />
          <TextInput
            style={styles.dateInput}
            placeholder="Hora de inicio"
            value={horaInicio}
            onChangeText={setHoraInicio}
          />
        </View>
      </View>

      {/* BOTÓN GUARDAR CAMBIOS */}
      <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
        <Text style={styles.btnText}>GUARDAR CAMBIOS</Text>
      </TouchableOpacity>

      {/* BOTÓN ELIMINAR */}
      <TouchableOpacity style={styles.btnEliminar} onPress={eliminarMedicamento}>
        <Text style={styles.btnEliminarText}>ELIMINAR MEDICAMENTO</Text>
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
