import React from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';

export default function PantallaInicio({ navigation }) {
  console.log("PantallaInicio cargó correctamente");
  return (
    <View style={styles.splashContainer}>

      <ScrollView contentContainerStyle={styles.overlay}>

        {/* LOGO */}
        <Image
          source={require('../assets/MediTrackLogo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Bienvenido a</Text>
        <Text style={styles.appName}>MediTrack</Text>

        <Text style={styles.subtitle}>
          Tu asistente inteligente para el control de tus medicamentos
        </Text>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonSpacing}>
            <Button
              title="Iniciar Sesión"
              color="#2D8BFF"
              onPress={() => navigation.navigate('Login')}
            />
          </View>

          <View style={styles.buttonSpacing}>
            <Button
              title="Registrarse"
              color="#555"
              onPress={() => navigation.navigate('Registro')}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#00aae4",
  },
  overlay: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  appName: {
    fontSize: 42,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#E8F2FF",
    textAlign: "center",
    marginBottom: 40,
    width: "85%",
  },
  buttonsContainer: {
    width: "80%",
  },
  buttonSpacing: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
});
