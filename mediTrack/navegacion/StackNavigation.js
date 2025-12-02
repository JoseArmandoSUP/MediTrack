import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PantallaInicio from "../screens/PantallaInicio";
import PantallaInicioSesion from "../screens/PantallaInicioSesion";
import PantallaRegistro from "../screens/PantallaRegistro";
import TabNavigation from "./TabNavigation";

// CRUD
import PantallaAgregarMedicamento from "../screens/PantallaAgregarMedicamento";
import PantallaEditarMedicamento from "../screens/PantallaEditarMedicamento";
import PantallaMisMedicinas from "../screens/PantallaMisMedicinas";
import PantallaEliminarMedicamento from "../screens/PantallaEliminarMedicamento";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="PantallaInicio"
    >
      {/* Pantallas iniciales */}
      <Stack.Screen name="PantallaInicio" component={PantallaInicio} />

      {/* LOGIN: registrar con ambos nombres para compatibilidad */}
      <Stack.Screen name="PantallaInicioSesion" component={PantallaInicioSesion} />
      <Stack.Screen name="Login" component={PantallaInicioSesion} />

      {/* REGISTRO: alias si hay llamadas antiguas */}
      <Stack.Screen name="PantallaRegistro" component={PantallaRegistro} />
      <Stack.Screen name="Registro" component={PantallaRegistro} />

      {/* Pantallas principales (Tabs) */}
      <Stack.Screen name="TabNavigation" component={TabNavigation} />

      {/* CRUD */}
      <Stack.Screen name="AgregarMedicamento" component={PantallaAgregarMedicamento} />
      <Stack.Screen name="PantallaEditarMedicamento" component={PantallaEditarMedicamento} />
      <Stack.Screen name="PantallaMisMedicinas" component={PantallaMisMedicinas} />
      <Stack.Screen name="PantallaEliminarMedicamento" component={PantallaEliminarMedicamento} />
    </Stack.Navigator>
  );
}