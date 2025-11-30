import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PantallaInicio from "../screens/PantallaInicio";
import PantallaInicioSesion from "../screens/PantallaInicioSesion";
import PantallaRegistro from "../screens/PantallaRegistro";
import TabNavigation from "./TabNavigation";
import MisMedicamentos from "../screens/MisMedicamentos";

import PantallaAgregarMedicamento from "../screens/PantallaAgregarMedicamento";
import PantallaEditarMedicamento from "../screens/PantallaEditarMedicamento";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inicio">

      {/* Pantallas iniciales */}
      <Stack.Screen name="Inicio" component={PantallaInicio} />
      <Stack.Screen name="Login" component={PantallaInicioSesion} />
      <Stack.Screen name="Registro" component={PantallaRegistro} />

      {/* Pantallas principales (Tabs) */}
      <Stack.Screen name="TabNavigation" component={TabNavigation} />

      {/* CRUD */}
      <Stack.Screen name="AgregarMedicamento" component={PantallaAgregarMedicamento} />
      <Stack.Screen name="PantallaEditarMedicamento" component={PantallaEditarMedicamento} />

      <Stack.Screen name="MisMedicamentos" component={MisMedicamentos}/>
    </Stack.Navigator>
  );
}
