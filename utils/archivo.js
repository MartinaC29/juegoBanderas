const fs = require('fs');
const path = require('path');

const directorio = path.join(__dirname, '../data');
const archivo = path.join(directorio, 'ranking.json');

function leerPartidas() {
  try {
    if (!fs.existsSync(archivo)) {
      return [];
    }

    const data = fs.readFileSync(archivo, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de ranking:', error);
    return [];
  }
}

function guardarPartidas(partidas) {
  try {
    // Asegurar que el directorio existe
    if (!fs.existsSync(directorio)) {
      fs.mkdirSync(directorio, { recursive: true });
    }

    fs.writeFileSync(archivo, JSON.stringify(partidas, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar el archivo de ranking:', error);
  }
}

module.exports = { leerPartidas, guardarPartidas };
