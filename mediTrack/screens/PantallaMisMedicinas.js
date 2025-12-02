import React, { useState, useEffect, useCallback } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert,ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MedicamentoController } from "../controllers/MedicamentoController";

const controller = new MedicamentoController();

export default function MisMedicinas({ navigation, route }) {

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  // SELECT – Cargar medicamentos
  const cargarMedicamentos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await controller.obtenerMedicamentos();
      setLista(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicializar BD y cargar datos
  useEffect(() => {
    const init = async () => {
      await controller.initialize();
      await cargarMedicamentos();
    };
    init();

    // Suscribir cambios automáticos
    controller.addListener(cargarMedicamentos);

    return () => controller.removeListener(cargarMedicamentos);
  }, [cargarMedicamentos]);

  //-------------Regcargar Datos---------------
  useEffect(() => {
    if (route?.params?.refrescar) {
      cargarMedicamentos();
    }
  }, [route?.params]);


  function irEditar(item) {
    navigation.navigate("PantallaEditarMedicamento", { medicamento: item });
  }

  function irAgregar() {
    navigation.navigate("AgregarMedicamento");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Medicinas</Text>

      {/* LOADING */}
      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#2D8BFF" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Cargando medicamentos...
          </Text>
        </View>
      ) : (
        <ScrollView style={{ width: "100%" }}>
          {lista.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#555", marginBottom: 5 }}>
                No hay medicamentos registrados
              </Text>
              <Text style={{ color: "#888" }}>
                Agrega uno con el botón de abajo
              </Text>
            </View>
          ) : (
            lista.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => irEditar(item)}
              >
                <View>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.cardSubtitle}>
                    Dosis: {item.dosis}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Frecuencia: {item.frecuencia}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#2D8BFF" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.backButtonBottom} 
        onPress={() => navigation.navigate("TabNavigation")}
      >
        <Ionicons name="home-outline" size={22} color="green" />
        <Text style={{ color: "green", marginLeft: 8, fontWeight: "600" }}>
          Volver al menú
        </Text>
      </TouchableOpacity>

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
    alignContent: "center"
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

  backButtonBottom: {
  marginTop: 20,           
  alignSelf: "center",     
  backgroundColor: "white",
  borderWidth: 2,
  borderColor: "green",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
},

});