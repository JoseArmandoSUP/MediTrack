import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  PixelRatio,
  Platform,
  StatusBar,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function PantallaPrincipal({ navigation }) {
  const { width } = useWindowDimensions();
  const guidelineBaseWidth = 375;
  const scale = width / guidelineBaseWidth;

  const normalize = (size) =>
    Math.round(PixelRatio.roundToNearestPixel(size * scale));

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const paddingGlobal = clamp(normalize(16), 10, 28);
  const headerFont = clamp(normalize(18), 14, 24);
  const blueBoxPadding = clamp(normalize(18), 12, 30);
  const blueBoxRadius = clamp(normalize(18), 10, 28);
  const medItemPadding = clamp(normalize(12), 8, 18);
  const medNameFont = clamp(normalize(16), 12, 20);
  const medTimeFont = clamp(normalize(13), 10, 16);
  const optionPadding = clamp(normalize(12), 8, 18);
  const optionFont = clamp(normalize(16), 12, 20);
  const iconBase = clamp(normalize(22), 16, 34);

  const androidTopPadding = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  const styles = createStyles({
    paddingGlobal,
    headerFont,
    blueBoxPadding,
    blueBoxRadius,
    medItemPadding,
    medNameFont,
    medTimeFont,
    optionPadding,
    optionFont,
    iconBase,
    width,
    androidTopPadding,
  });

  const upcomingMeds = [
    { name: "Paracetamol 500 mg", time: "Mañana a las 20:00" },
    { name: "Ibuprofeno 300 mg", time: "Mañana a las 07:00" },
    { name: "Dropropizina 10 ml", time: "Mañana a las 06:00" },
  ];

  // Estado para el modal de Historial
  const [historialVisible, setHistorialVisible] = useState(false);

  // Ejemplo de items de historial (puedes reemplazar por datos reales)
  const historyItems = [
    { id: "1", title: "Paracetamol 500 mg", date: "2025-11-30 20:00", note: "Tomado" },
    { id: "2", title: "Ibuprofeno 300 mg", date: "2025-11-30 07:00", note: "Pendiente" },
    { id: "3", title: "Dropropizina 10 ml", date: "2025-11-29 06:00", note: "Tomado" },
  ];

  const notAvailableAlert = (title = "Próximamente") => {
    Alert.alert(
      title,
      "Esta función aún no está disponible. Estamos trabajando en ello.",
      [{ text: "Aceptar" }]
    );
  };

  const openHistorial = () => {
    setHistorialVisible(true);
  };

  const closeHistorial = () => {
    setHistorialVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.username} numberOfLines={1}>
            Usuario
          </Text>

          <TouchableOpacity
            style={styles.configBtn}
            activeOpacity={0.7}
            onPress={() => {}}
            accessibilityLabel="Ajustes"
          >
            <Ionicons name="settings-outline" size={styles.iconSize} color="#575757" />
          </TouchableOpacity>
        </View>

        <View style={styles.blueBox}>
          <Text style={styles.blueBoxTitle}>Próximos medicamentos:</Text>

          {upcomingMeds.map((item, i) => (
            <View key={i} style={styles.medItem}>
              <View style={styles.medText}>
                <Text style={styles.medName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.medTime}>{item.time}</Text>
              </View>
              <Ionicons
                name="notifications-outline"
                size={Math.round(styles.iconSize * 0.95)}
                color="#2D8BFF"
                accessibilityLabel={`Recordatorio ${item.name}`}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("PantallaMisMedicinas")}
          accessibilityRole="button"
        >
          <Ionicons name="medkit-outline" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Mis medicinas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => notAvailableAlert("Recordatorios")}
          accessibilityRole="button"
          accessibilityLabel="Recordatorios no disponibles"
        >
          <FontAwesome5 name="bell" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Recordatorios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={openHistorial}
          accessibilityRole="button"
          accessibilityLabel="Abrir historial"
        >
          <MaterialIcons name="history" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => notAvailableAlert("Reportes")}
          accessibilityRole="button"
          accessibilityLabel="Reportes no disponibles"
        >
          <MaterialIcons name="description" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Reportes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Historial */}
      <Modal
        visible={historialVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeHistorial}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Historial de medicación</Text>
              <Pressable onPress={closeHistorial} accessibilityLabel="Cerrar historial" style={modalStyles.closeBtn}>
                <Ionicons name="close" size={22} color="#444" />
              </Pressable>
            </View>

            <ScrollView style={modalStyles.body} contentContainerStyle={{ paddingBottom: 12 }}>
              {historyItems.length === 0 ? (
                <View style={modalStyles.empty}>
                  <Text style={modalStyles.emptyText}>No hay elementos en el historial</Text>
                </View>
              ) : (
                historyItems.map((h) => (
                  <View key={h.id} style={modalStyles.historyItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={modalStyles.historyTitle}>{h.title}</Text>
                      <Text style={modalStyles.historyDate}>{h.date}</Text>
                    </View>
                    <Text style={[modalStyles.historyNote, { color: h.note === "Tomado" ? "#2D8BFF" : "#FF7A7A" }]}>
                      {h.note}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={modalStyles.footer}>
              <TouchableOpacity style={modalStyles.actionBtn} onPress={closeHistorial}>
                <Text style={modalStyles.actionText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(s) {
  const {
    paddingGlobal,
    headerFont,
    blueBoxPadding,
    blueBoxRadius,
    medItemPadding,
    medNameFont,
    medTimeFont,
    optionPadding,
    optionFont,
    iconBase,
    androidTopPadding,
  } = s;

  const iconSize = Math.round(iconBase);

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#E8F2FF",
      paddingTop: androidTopPadding,
    },
    container: {
      padding: paddingGlobal,
      backgroundColor: "#E8F2FF",
      flexGrow: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: paddingGlobal / 2,
    },
    username: {
      fontWeight: "600",
      fontSize: headerFont,
      color: "#111",
      flexShrink: 1,
    },
    configBtn: {
      marginLeft: "auto",
      paddingHorizontal: 6,
      paddingVertical: Platform.OS === "ios" ? 6 : 4,
    },
    blueBox: {
      marginTop: paddingGlobal,
      backgroundColor: "#2D8BFF",
      borderRadius: blueBoxRadius,
      padding: blueBoxPadding,
      width: "100%",
    },
    blueBoxTitle: {
      color: "white",
      fontWeight: "700",
      marginBottom: blueBoxPadding / 3,
      fontSize: clampFont(headerFont, 14, 22),
    },
    medItem: {
      backgroundColor: "white",
      borderRadius: Math.round(blueBoxRadius * 0.65),
      marginBottom: medItemPadding,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: medItemPadding,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    medText: {
      flex: 1,
      paddingRight: 8,
    },
    medName: {
      fontWeight: "700",
      fontSize: medNameFont,
      color: "#111",
    },
    medTime: {
      color: "#555",
      fontSize: medTimeFont,
      marginTop: 4,
    },
    option: {
      backgroundColor: "white",
      marginTop: optionPadding,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: Math.round(blueBoxRadius * 0.6),
      padding: optionPadding,
      width: "100%",
    },
    optionText: {
      marginLeft: 12,
      fontWeight: "600",
      color: "#333",
      fontSize: optionFont,
      flexShrink: 1,
    },
    iconSize,
  });
}

function clampFont(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 18,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },
  historyDate: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  historyNote: {
    marginLeft: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  empty: {
    paddingVertical: 36,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
  footer: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#2D8BFF",
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});