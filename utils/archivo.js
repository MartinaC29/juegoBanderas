const fs = require('fs');
const path = require('path');

const archivo = path.join(__dirname, '../data/ranking.json');

function leerPartidas() {
  if (!fs.existsSync(archivo)) return [];

  try {
    const data = fs.readFileSync(archivo, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de ranking:', error);
    return [];
  }
}

function guardarPartidas(partidas) {
  try {
    fs.writeFileSync(archivo, JSON.stringify(partidas, null, 2));
  } catch (error) {
    console.error('Error al guardar el archivo de ranking:', error);
  }
}

module.exports = { leerPartidas, guardarPartidas };
