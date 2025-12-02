import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MedicamentoController } from "../controllers/MedicamentoController";

const medController = new MedicamentoController();

export default function PantallaPrincipal({ navigation }) {

  const [usuario, setUsuario] = useState("Usuario");
  const [medicinas, setMedicinas] = useState([]);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const data = await AsyncStorage.getItem("usuarioActivo");
        if (data) {
          const user = JSON.parse(data);
          setUsuario(user.nombre);
        }
      } catch (error) {
        console.log("Error al cargar usuario:", error);
      }
    }
    cargarUsuario();
  }, []);

  //Actualiza cambios
  useEffect(() => {
    async function cargar() {
      try {
        await medController.initialize();
        const lista = await medController.obtenerMedicamentos();
        setMedicinas(lista);
      } catch (error) {
        console.log("Error al cargar medicinas:", error);
      }
    }

    cargar(); // carga inicial

    // Suscribirse a cambios en la BD
    medController.addListener(cargar);

    return () => medController.removeListener(cargar);
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.username}>{usuario}</Text>

        <TouchableOpacity
          style={styles.configBtn}
          onPress={() => navigation.navigate("PantallaUsuario")}
        >
          <Ionicons name="settings-outline" size={28} color="#575757" />
        </TouchableOpacity>
      </View>

      {/* BOX AZUL */}
      <View style={styles.blueBox}>
        <Text style={styles.blueBoxTitle}>Próximos medicamentos:</Text>

        {/* Si no hay medicinas */}
        {medicinas.length === 0 && (
          <Text style={{ color: "white", textAlign: "center" }}>
            No tienes medicamentos registrados
          </Text>
        )}

        {/* Mostrar máximo 3 medicamentos */}
        {medicinas.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.medItem}>
            <View>
              <Text style={styles.medName}>{item.nombre}</Text>
              <Text style={styles.medTime}>Frecuencia: {item.frecuencia}</Text>
            </View>
            <Ionicons name="notifications-outline" size={26} color="#2D8BFF" />
          </View>
        ))}
      </View>

      {/* OPCIONES */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("PantallaMisMedicinas")}
      >
        <Ionicons name="medkit-outline" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Mis medicinas</Text>
      </TouchableOpacity>

      <Text>Estaticos</Text>

      <TouchableOpacity style={styles.option}>
        <FontAwesome5 name="bell" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Recordatorios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="history" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Historial</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="description" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Reportes</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#E8F2FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
  configBtn: {
    marginLeft: "auto",
  },
  blueBox: {
    marginTop: 20,
    backgroundColor: "#2D8BFF",
    padding: 20,
    borderRadius: 20,
  },
  blueBoxTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  medItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medName: {
    fontSize: 16,
    fontWeight: "700",
  },
  medTime: {
    fontSize: 13,
    color: "#555",
  },
  option: {
    backgroundColor: "white",
    padding: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
