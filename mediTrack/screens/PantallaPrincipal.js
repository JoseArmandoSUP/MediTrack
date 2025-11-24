import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function PantallaPrincipal({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        {/*<Image
          source={require("../assets/user.png")}
          style={styles.profilePic}
        />*/}
        <Text style={styles.username}>Usuario</Text>

        <TouchableOpacity style={styles.configBtn}>
          <Ionicons name="settings-outline" size={28} color="#575757" />
        </TouchableOpacity>
      </View>

      {/* BOX AZUL */}
      <View style={styles.blueBox}>
        <Text style={styles.blueBoxTitle}>Próximos medicamentos:</Text>

        {/* ITEM */}
        <View style={styles.medItem}>
          <View>
            <Text style={styles.medName}>Paracetamol 500 mg</Text>
            <Text style={styles.medTime}>Mañana a las 8:00 pm</Text>
          </View>
          <Ionicons name="notifications-outline" size={26} color="#2D8BFF" />
        </View>

        <View style={styles.medItem}>
          <View>
            <Text style={styles.medName}>Ibuprofeno 300 mg</Text>
            <Text style={styles.medTime}>Mañana a las 7:00 am</Text>
          </View>
          <Ionicons name="notifications-outline" size={26} color="#2D8BFF" />
        </View>

        <View style={styles.medItem}>
          <View>
            <Text style={styles.medName}>Dropropizina 10 ml</Text>
            <Text style={styles.medTime}>Mañana a las 6:00 am</Text>
          </View>
          <Ionicons name="notifications-outline" size={26} color="#2D8BFF" />
        </View>
      </View>

      {/* OPCIONES */}
      <TouchableOpacity style={styles.option}>
        <Ionicons name="medkit-outline" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Mis medicinas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <FontAwesome5 name="bell" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Recordatorios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="history" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Historial</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="description" size={22} color="#2D8BFF" />
        <Text style={styles.optionText}>Reportes</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F2FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
  configBtn: {
    marginLeft: "auto",
  },

  blueBox: {
    marginTop: 20,
    backgroundColor: "#2D8BFF",
    padding: 20,
    borderRadius: 20,
  },
  blueBoxTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  medItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medName: {
    fontSize: 16,
    fontWeight: "700",
  },
  medTime: {
    fontSize: 13,
    color: "#555",
  },

  option: {
    backgroundColor: "white",
    padding: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
