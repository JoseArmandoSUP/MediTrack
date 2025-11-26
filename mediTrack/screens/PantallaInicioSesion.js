import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from "react-native";

export default function PantallaInicioSesion({ navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Ingresa tu correo y contraseña");
      return;
    }

    // Navega al panel principal
    navigation.replace("TabNavigation");
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <Button title="Entrar" color="#2D7BE8" onPress={handleLogin} />
      </View>

      <TouchableOpacity
        onPress={() => Alert.alert("Recuperar contraseña", "Función demo")}
      >
        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={styles.register}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    color: "#1A1A1A",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCD8E0",
    backgroundColor: "#F5F9FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 12,
    overflow: "hidden",
  },
  forgot: {
    color: "#2D7BE8",
    textAlign: "center",
    marginBottom: 15,
  },
  register: {
    color: "#4B4B4B",
    textAlign: "center",
    fontSize: 14,
  },
});
