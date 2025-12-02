import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

const controller = new UsuarioController();

export default function PantallaRecuperar({ navigation }) {

  const [correo, setCorreo] = useState("");

  async function validarCorreo() {
    if (!correo.trim()) {
      Alert.alert("Error", "Ingresa tu correo electrónico");
      return;
    }

    try {
      await controller.initialize();

      const usuario = await controller.obtenerUsuarioPorCorreo(correo.trim());

      if (!usuario) {
        Alert.alert("Error", "El correo no está registrado");
        return;
      }

      navigation.navigate("PantallaCambiarContraseña", { correo: correo.trim() });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo registrado"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={validarCorreo}>
        <Text style={styles.btnText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#E8F2FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#2D8BFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
