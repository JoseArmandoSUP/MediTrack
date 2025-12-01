import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MisMedicinas({ navigation }) {

  // Temporal: una lista demostrativa
  // Luego la remplazamos con SELECT desde SQLite
  const [lista, setLista] = useState([
    { id: 1, nombre: "Paracetamol 500 mg", frecuencia: "Cada 8 horas" },
    { id: 2, nombre: "Ibuprofeno 300 mg", frecuencia: "Cada 12 horas" },
    { id: 3, nombre: "Dropropizina 10 ml", frecuencia: "Cada 6 horas" },
  ]);

  function irEditar(item) {
    navigation.navigate("PantallaEditarMedicamento", { medicamento: item });
  }

  function irAgregar() {
    navigation.navigate("AgregarMedicamento");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Medicinas</Text>

      <ScrollView style={{ width: "100%" }}>

        {lista.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => irEditar(item)}
          >
            <View>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardSubtitle}>{item.frecuencia}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#2D8BFF" />
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* BOTÓN AGREGAR */}
      <TouchableOpacity style={styles.addButton} onPress={irAgregar}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F2FF",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#777",
  },
  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#2D8BFF",
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
