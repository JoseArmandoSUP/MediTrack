import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PantallaPerfil({ navigation }) {

  const [usuario, setUsuario] = useState({ nombre: "", correo: "" });

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const data = await AsyncStorage.getItem("usuarioActivo");
        if (data) {
          const user = JSON.parse(data);
          setUsuario(user);
        }
      } catch (error) {
        console.log("Error al leer usuario:", error);
      }
    }
    cargarUsuario();
  }, []);

  async function cerrarSesion() {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("usuarioActivo");
            navigation.replace("Login");
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* Datos del usuario */}
      <View style={styles.card}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{usuario.nombre}</Text>

        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.value}>{usuario.correo}</Text>
      </View>

      {/* Botón cerrar sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={cerrarSesion}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#E8F2FF",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#086be4ff",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  logoutBtn: {
    backgroundColor: "#D9534F",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
