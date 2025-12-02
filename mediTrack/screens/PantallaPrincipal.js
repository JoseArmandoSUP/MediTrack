import React from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function PantallaPrincipal({ navigation }) {
  const { width, height } = useWindowDimensions();
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

        <TouchableOpacity style={styles.option} activeOpacity={0.7}>
          <FontAwesome5 name="bell" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Recordatorios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} activeOpacity={0.7}>
          <MaterialIcons name="history" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} activeOpacity={0.7}>
          <MaterialIcons name="description" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Reportes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("PantallaMisMedicinas", { editMode: true })}
        >
          <MaterialIcons name="pencil" size={styles.iconSize} color="#2D8BFF" />
          <Text style={styles.optionText}>Editar Medicamento</Text>
        </TouchableOpacity>
      </ScrollView>
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
    width,
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