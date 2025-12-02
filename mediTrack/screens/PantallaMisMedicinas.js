import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MedicamentoController } from "../controllers/MedicamentoController";

const controller = new MedicamentoController();

export default function MisMedicinas({ navigation, route }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para mostrar información completa en la misma pantalla
  const [selectedItem, setSelectedItem] = useState(null);

  // Scroll ref para desplazar la vista hacia arriba cuando mostramos detalles
  const scrollRef = useRef(null);

  // Ajuste de padding para evitar que la UI se superponga con la barra superior
  const androidTopPadding = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 8 : 0;

  // SELECT – Cargar medicamentos
  const cargarMedicamentos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await controller.obtenerMedicamentos();
      setLista(data || []);
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

  //-------------Recargar Datos---------------
  useEffect(() => {
    if (route?.params?.refrescar) {
      cargarMedicamentos();
    }
  }, [route?.params?.refrescar, cargarMedicamentos]);

  // Si venimos de la pantalla de agregar y nos pasan el nuevo medicamento,
  // recargamos la lista (por si el controlador no lo devuelve inmediatamente)
  // y seleccionamos ese medicamento para mostrar sus detalles en la misma pantalla.
  useEffect(() => {
    const nuevo = route?.params?.nuevoMedicamento;
    if (nuevo) {
      // Recargar lista para asegurar que esté persistido y tenga id correcto
      (async () => {
        await cargarMedicamentos();
        // Intentamos localizar el medicamento en la lista por id o por nombre
        setTimeout(() => {
          const encontrado = lista.find((m) => m.id === nuevo.id) || lista.find((m) => m.nombre === nuevo.nombre) || nuevo;
          setSelectedItem(encontrado || nuevo);

          // Desplazar hacia arriba para ver el panel de detalle (si aplica)
          setTimeout(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          }, 100);
        }, 200);
      })();

      // limpiar el param para evitar que vuelva a abrirse
      try {
        navigation.setParams({ nuevoMedicamento: undefined });
      } catch (e) {
        // no crítico si falla en algunos flujos
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.nuevoMedicamento, cargarMedicamentos, lista]);

  function irEditar(item) {
    navigation.navigate("PantallaEditarMedicamento", { medicamento: item });
  }

  function irAgregar() {
    navigation.navigate("AgregarMedicamento");
  }

  // Mostrar/ocultar detalles en la misma pantalla
  function mostrarDetalles(item) {
    // Si ya está seleccionado, colapsar al tocar de nuevo
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
      return;
    }
    setSelectedItem(item);

    // Desplazar hacia arriba para mostrar el panel
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  }

  // Renderiza todas las propiedades del medicamento con etiquetas amigables
  function renderDetalles(item) {
    if (!item) return null;

    // Define etiquetas legibles para claves conocidas
    const labels = {
      nombre: "Nombre",
      dosis: "Dosis",
      frecuencia: "Frecuencia",
      hora: "Hora",
      inicio: "Inicio",
      fin: "Fin",
      notas: "Notas",
      id: "ID",
    };

    // Orden predefinido (mostrar lo más relevante primero)
    const preferredOrder = ["nombre", "dosis", "frecuencia", "hora", "inicio", "fin", "notas", "id"];
    const keys = Object.keys(item).sort((a, b) => {
      const ai = preferredOrder.indexOf(a);
      const bi = preferredOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>{item.nombre || "Detalle del medicamento"}</Text>
          <View style={styles.detailsActions}>
            <TouchableOpacity onPress={() => { setSelectedItem(null); }} style={styles.iconButton} accessibilityLabel="Cerrar detalle">
              <Ionicons name="close" size={20} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => irEditar(item)} style={styles.iconButton} accessibilityLabel="Editar medicamento">
              <Ionicons name="pencil" size={20} color="#2D8BFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsBody}>
          {keys.map((k) => {
            const raw = item[k];
            if (raw === null || raw === undefined || raw === "") return null; // no mostrar vacíos
            let display = String(raw);

            // Formateo simple para fechas ISO
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(display)) {
              try {
                display = new Date(display).toLocaleString();
              } catch (e) {}
            }

            return (
              <View style={styles.detailRow} key={k}>
                <Text style={styles.detailKey}>{labels[k] || k}</Text>
                <Text style={styles.detailValue}>{display}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: androidTopPadding }]}>
      {/* HEADER con botón que regresa a inicio */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("PantallaInicio");
            }
          }}
          accessibilityLabel="Ir al inicio"
        >
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Mis Medicinas</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Panel de detalles (aparece en la parte superior de la lista) */}
      {selectedItem && renderDetalles(selectedItem)}

      {/* LOADING */}
      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#2D8BFF" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Cargando medicamentos...
          </Text>
        </View>
      ) : (
        <ScrollView ref={scrollRef} style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 120 }}>
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
                onPress={() => mostrarDetalles(item)} // ahora muestra detalles en la pantalla
                onLongPress={() => irEditar(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.cardSubtitle}>
                    {item.dosis ? `Dosis: ${item.dosis} • ` : ""}Frecuencia: {item.frecuencia}
                  </Text>
                </View>
                <Ionicons name={selectedItem && selectedItem.id === item.id ? "chevron-down" : "chevron-forward"} size={24} color="#2D8BFF" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* BOTÓN AGREGAR */}
      <TouchableOpacity style={styles.addButton} onPress={irAgregar} accessibilityLabel="Agregar medicamento">
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F2FF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
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
    marginTop: 6,
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

  /* Detalle en pantalla */
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailsTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  detailsActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
  },
  detailsBody: {
    marginTop: 6,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailKey: {
    fontSize: 12,
    color: "#666",
    textTransform: "capitalize",
  },
  detailValue: {
    fontSize: 15,
    color: "#222",
    marginTop: 2,
  },
});