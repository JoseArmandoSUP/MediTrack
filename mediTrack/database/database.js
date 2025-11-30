import * as SQLite from "expo-sqlite";

// 🔹 Abrimos la base de datos con el método correcto en expo-sqlite 16.x
const db = SQLite.openDatabaseSync("medicamentos.db");

// Inicializar BD
export function initDB() {
  console.log("Iniciando base de datos...");

  db.execAsync(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      dosis TEXT NOT NULL,
      frecuencia TEXT NOT NULL,
      notas TEXT,
      fechaInicio TEXT NOT NULL,
      horaInicio TEXT NOT NULL
    );
  `)
    .then(() => console.log("BD lista"))
    .catch(err => console.log("Error al crear BD:", err));
}

// INSERTAR
export async function insertMedicamento(med) {
  try {
    await db.runAsync(
      `INSERT INTO medicamentos (nombre, dosis, frecuencia, notas, fechaInicio, horaInicio)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        med.nombre,
        med.dosis,
        med.frecuencia,
        med.notas,
        med.fechaInicio,
        med.horaInicio,
      ]
    );
    return true;
  } catch (error) {
    console.log("Error al insertar:", error);
    return false;
  }
}

// OBTENER
export async function getMedicamentos() {
  try {
    const result = await db.getAllAsync("SELECT * FROM medicamentos");
    return result; // ← devuelve array
  } catch (error) {
    console.log("Error al obtener:", error);
    return [];
  }
}

// ACTUALIZAR
export async function updateMedicamento(med) {
  try {
    await db.runAsync(
      `UPDATE medicamentos SET
       nombre=?, dosis=?, frecuencia=?, notas=?, fechaInicio=?, horaInicio=?
       WHERE id=?`,
      [
        med.nombre,
        med.dosis,
        med.frecuencia,
        med.notas,
        med.fechaInicio,
        med.horaInicio,
        med.id,
      ]
    );
    return true;
  } catch (error) {
    console.log("Error al actualizar:", error);
    return false;
  }
}

// ELIMINAR
export async function deleteMedicamento(id) {
  try {
    await db.runAsync(`DELETE FROM medicamentos WHERE id=?`, [id]);
    return true;
  } catch (error) {
    console.log("Error al eliminar:", error);
    return false;
  }
}

export default db;