import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PantallaInicioSesion({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  };

  // Comprueba recursivamente si una ruta existe en el state del navigator
  function routeExistsInState(state, targetName) {
    if (!state) return false;
    const routes = state.routes || [];
    for (const r of routes) {
      if (r.name === targetName) return true;
      if (r.state && routeExistsInState(r.state, targetName)) return true;
    }
    return false;
  }

  // Navegación robusta: intenta parent -> current -> reset como fallback
  function navigateRobust(name) {
    try {
      const parent = navigation.getParent ? navigation.getParent() : null;
      const state = navigation.getState ? navigation.getState() : null;

      if (parent && parent.navigate && state && routeExistsInState(state, name)) {
        parent.navigate(name);
        return;
      }

      if (navigation && navigation.navigate && state && routeExistsInState(state, name)) {
        navigation.navigate(name);
        return;
      }
    } catch (e) {
      // continuar con fallback
    }

    try {
      navigation.navigate(name);
      return;
    } catch (e) {
      // continuar con fallback
    }

    try {
      navigation.reset({
        index: 0,
        routes: [{ name }],
      });
      return;
    } catch (e) {
      // último recurso: informar al usuario
      Alert.alert("Navegación", `No se pudo navegar a ${name}. Reinicia la app o vuelve al inicio manualmente.`);
    }
  }

  async function handleLogin() {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Ingresa tu correo y contraseña");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Ingresa un correo válido");
      return;
    }

    setLoading(true);

    try {
      const raw = await AsyncStorage.getItem("@users");
      const users = raw ? JSON.parse(raw) : [];

      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (found) {
        const token = `token-${Date.now()}`;
        await AsyncStorage.setItem("@app_token", token);
        await AsyncStorage.setItem("@user_email", found.email);

        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigation" }],
        });
        return;
      }

      // Fallback demo account
      const demoEmail = "demo@demo.com";
      const demoPassword = "demo123";
      if (email === demoEmail && password === demoPassword) {
        const token = "token-demo-123456";
        await AsyncStorage.setItem("@app_token", token);
        await AsyncStorage.setItem("@user_email", demoEmail);

        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigation" }],
        });
        return;
      }

      throw new Error("Credenciales incorrectas. Regístrate o verifica tu correo/contraseña.");
    } catch (error) {
      Alert.alert("Error de inicio de sesión", error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Iniciar Sesión</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          textContentType="emailAddress"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          textContentType="password"
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingText}>Iniciando sesión...</Text>
            </View>
          ) : (
            <Button title="Entrar" color="#2D7BE8" onPress={handleLogin} />
          )}
        </View>

        <TouchableOpacity onPress={() => Alert.alert("Recuperar contraseña", "Función demo")}>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateRobust("PantallaRegistro")}>
          <Text style={styles.register}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />

        <View style={styles.demoBox}>
          <Text style={{ fontWeight: "700", marginBottom: 6 }}>Credenciales demo</Text>
          <Text style={{ color: "#333" }}>Email: demo@demo.com</Text>
          <Text style={{ color: "#333" }}>Contraseña: demo123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: "#2D7BE8",
  },
  forgot: {
    color: "#2D7BE8",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 15,
  },
  register: {
    color: "#4B4B4B",
    textAlign: "center",
    fontSize: 14,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  loadingText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
  demoBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F1F8FF",
    alignItems: "center",
  },
});