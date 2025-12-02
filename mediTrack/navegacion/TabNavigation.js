import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import PantallaPrincipal from "../screens/PantallaPrincipal";
import PantallaAgregarMedicamento from "../screens/PantallaAgregarMedicamento";
import Perfil from "../screens/Perfil";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 65,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "#2D8BFF",
        tabBarInactiveTintColor: "#777",
      }}
    >
      
      <Tab.Screen
        name="Inicio"
        component={PantallaPrincipal}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AgregarMedicamento"
        component={PantallaAgregarMedicamento}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
