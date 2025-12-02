import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, Image } from "react-native";

import { UsuarioController } from "../controllers/UsuarioController";

const controller = new UsuarioController();

export default function PantallaRegistro({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [accepted, setAccepted] = useState(false);

  async function AlertaRegistrar() {

    if (!name || !email || !pass || !confirmPass) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    if (pass !== confirmPass) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!accepted) {
      Alert.alert("Error", "Debe aceptar los términos");
      return;
    }

    try {
      await controller.initialize();

      // Registrar usuario en SQLite
      await controller.registrar(
        name.trim(),
        email.trim(),
        pass.trim()
      );

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta ha sido creada correctamente",
        [
          {
            text: "Ir al login",
            onPress: () => navigation.navigate("Login"),
          }
        ]
      );

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* LOGO */}
      <Image source={require("../assets/MediTrackLogo.png")} style={styles.logo} />

      <Text style={styles.title}>REGISTRARSE</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Establecer contraseña"
        value={pass}
        onChangeText={setPass}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmPass}
        onChangeText={setConfirmPass}
      />

      {/* Aceptar términos */}
      <View style={styles.row}>
        <Switch value={accepted} onValueChange={setAccepted} />
        <Text style={styles.acceptText}>He leído los términos y condiciones</Text>
      </View>

      <TouchableOpacity onPress={() => Alert.alert("Acepto que mis datos seran usados con fines de lucro")}>
        <Text style={styles.terms}>Ver términos y condiciones</Text>
      </TouchableOpacity>

      {/* Botón principal */}
      <TouchableOpacity style={styles.registerBtn} onPress={AlertaRegistrar}>
        <Text style={styles.registerText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Ir al login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2D8BFF",
    padding: 25,
    alignItems: "center",
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 15,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  acceptText: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  terms: {
    color: "#E0F0FF",
    marginBottom: 20,
    marginTop: 3,
  },
  registerBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  registerText: {
    color: "#2D8BFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loginLink: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 30,
  },
});
