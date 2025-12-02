import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./navegacion/StackNavigation";
import { useEffect } from "react";
import { initDB } from "./database/database";

export default function App() {

  useEffect(() => {
  initDB();
}, []);


  return (
    <NavigationContainer>
      <StackNavigation/>
    </NavigationContainer>
  );
}