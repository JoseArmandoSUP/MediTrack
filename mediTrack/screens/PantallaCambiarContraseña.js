import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

const controller = new UsuarioController();

export default function PantallaCambiarContraseña({ route, navigation }) {

  const { correo } = route.params;
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  async function cambiarPass() {
    if (!pass1 || !pass2) {
      Alert.alert("Error", "Llena ambos campos");
      return;
    }

    if (pass1 !== pass2) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      await controller.initialize();
      await controller.cambiarContraseña(correo, pass1.trim());

      Alert.alert("Éxito", "Contraseña actualizada correctamente");
      navigation.navigate("Login");

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        value={pass1}
        onChangeText={setPass1}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={pass2}
        onChangeText={setPass2}
      />

      <TouchableOpacity style={styles.btn} onPress={cambiarPass}>
        <Text style={styles.btnText}>Guardar nueva contraseña</Text>
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
    backgroundColor: "#00C851",
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
