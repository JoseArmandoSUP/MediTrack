import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PantallaEliminarMedicamento({ route, navigation }) {

  const medicamento = route?.params?.medicamento;

  function eliminar() {
    Alert.alert(
      "Eliminar",
      `¿Deseas eliminar el medicamento "${medicamento.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Aquí luego haremos el DELETE real con SQLite
            Alert.alert("Eliminado", "El medicamento fue eliminado");
            navigation.navigate("MisMedicinas");
          }
        }
      ]
    );
  }

  if (!medicamento) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>No se recibió información del medicamento.</Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, padding: 10, backgroundColor: "#2D8BFF", borderRadius: 10 }}
        >
          <Text style={{ color: "white" }}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eliminar Medicamento</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{medicamento.nombre}</Text>
        <Text style={styles.info}>Dosis: {medicamento.dosis}</Text>
        <Text style={styles.info}>Frecuencia: {medicamento.frecuencia}</Text>
        <Text style={styles.info}>Fecha inicio: {medicamento.fechaInicio}</Text>
        <Text style={styles.info}>Hora inicio: {medicamento.horaInicio}</Text>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={eliminar}>
        <Ionicons name="trash-outline" size={22} color="white" />
        <Text style={styles.deleteText}>ELIMINAR DEFINITIVAMENTE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F2FF",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    marginBottom: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  deleteBtn: {
    flexDirection: "row",
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
