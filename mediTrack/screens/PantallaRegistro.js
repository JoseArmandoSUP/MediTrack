import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PantallaRegistro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [accepted, setAccepted] = useState(false);

  const validateEmail = (value) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  };

  // Navegación robusta al login: intenta parent, luego navigate, luego reset al root
  function navigateToLoginRobust() {
    try {
      // 1) Si hay parent (navigator superior), intentar ahí
      const parent = navigation.getParent ? navigation.getParent() : null;
      if (parent && parent.navigate) {
        parent.navigate("PantallaInicioSesion");
        return;
      }

      // 2) Intentar en el navigator actual
      if (navigation && navigation.navigate) {
        navigation.navigate("PantallaInicioSesion");
        return;
      }
    } catch (e) {
      console.warn("Error intentando navegar normalmente:", e);
    }

    try {
      // 3) Fallback: reset a la ruta raíz conocida (garantiza navegación aunque esté anidado)
      navigation.reset({
        index: 0,
        routes: [{ name: "PantallaInicioSesion" }],
      });
      return;
    } catch (e) {
      console.warn("reset falló:", e);
    }

    // 4) Ultimo recurso: informar al usuario
    Alert.alert("Registro", "Registro completado. Reinicia la app o vuelve al inicio manualmente.");
  }

  async function register() {
    if (!name || !email || !pass || !confirmPass) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Ingresa un correo válido");
      return;
    }

    if (pass.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (pass !== confirmPass) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!accepted) {
      Alert.alert("Error", "Debes aceptar los términos");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem("@users");
      const users = raw ? JSON.parse(raw) : [];

      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        Alert.alert("Error", "Ya existe una cuenta con ese correo");
        return;
      }

      const nuevo = {
        id: Date.now(),
        name,
        email: email.toLowerCase(),
        password: pass,
        created_at: new Date().toISOString(),
      };

      users.push(nuevo);
      await AsyncStorage.setItem("@users", JSON.stringify(users));

      Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión");
      navigateToLoginRobust();
    } catch (err) {
      console.error("Error registrando usuario:", err);
      Alert.alert("Error", "No se pudo completar el registro");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmPass}
        onChangeText={setConfirmPass}
        secureTextEntry
      />

      <View style={styles.row}>
        <Switch value={accepted} onValueChange={setAccepted} />
        <Text style={styles.acceptText}>He leído los términos y condiciones</Text>
      </View>

      <TouchableOpacity onPress={() => Alert.alert("Términos", "Aquí van los términos...")}>
        <Text style={styles.terms}>Ver términos y condiciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerBtn} onPress={register}>
        <Text style={styles.registerText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToLoginRobust}>
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