import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMedicamentos } from "../database/database";


export default function MisMedicamentos ({navigation}) {
    const [lista, setLista] = useState ([]);

    useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    cargarDatos();
  });
  return unsubscribe;
}, []);

async function cargarDatos() {
  const data = await getMedicamentos();
  setLista(data);
}


    return (
        <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.title}>Mis Medicamentos</Text>  
            
            {lista.length === 0 && (
                <Text style={styles.empty}>No hay medicamentos registrados</Text>
            )}

            {lista.map((item) => (
                <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => navigation.navigate ("PantallaEditarMedicamento", {medicamento: item})}
                >
                    <View>
                        <Text style={styles.name}>{item.nombre}</Text>
                        <Text style={styles.sub}>{item.dosis} - {item.frecuencia}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#555" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20, 
    },
    title:{
        fontSize: 24, 
        fontWeight: "700", 
        marginBottom: 20,
    }, 
    empty: {
        textAlign: "center", 
        color: "#888", 
        marginBttom: 20, 
    },
    card: {
        backgroundColor: "#fff", 
        padding: 15, 
        borderRadius: 12,
        marginBttom: 10, 
        flexDirection: 'row', 
        justifyContent: "space-between", 
        alignItems: "center"
    },
    name: {
        fontSize: 18,
        fontWeight: "700", 
    },
    sub: {
        fontSize: 14, 
        color: "#555"
    }
});