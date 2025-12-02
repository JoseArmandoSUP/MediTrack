import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("meditrack.db");

// Crear tabla
export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      dosis TEXT,
      frecuencia TEXT,
      notas TEXT,
      fechaInicio TEXT,
      horaInicio TEXT
    );
  `);
}

// Obtener todos los medicamentos
export function getMedicamentos() {
  return db.getAllSync("SELECT * FROM medicamentos");
}

// Insertar medicamento
export function insertMedicamento(med) {
  db.runSync(
    "INSERT INTO medicamentos (nombre, dosis, frecuencia, notas, fechaInicio, horaInicio) VALUES (?, ?, ?, ?, ?, ?)",
    [med.nombre, med.dosis, med.frecuencia, med.notas, med.fechaInicio, med.horaInicio]
  );
}

// Actualizar
export function updateMedicamento(med) {
  db.runSync(
    "UPDATE medicamentos SET nombre=?, dosis=?, frecuencia=?, notas=?, fechaInicio=?, horaInicio=? WHERE id=?",
    [med.nombre, med.dosis, med.frecuencia, med.notas, med.fechaInicio, med.horaInicio, med.id]
  );
}

// Eliminar
export function deleteMedicamento(id) {
  db.runSync("DELETE FROM medicamentos WHERE id=?", [id]);
}

export default {
  initDB,
  getMedicamentos,
  insertMedicamento,
  updateMedicamento,
  deleteMedicamento,
};
