const fs = require('fs');
const path = require('path');

const archivo = path.join(__dirname, '../data/ranking.json');

function leerPartidas() {
  if (!fs.existsSync(archivo)) return [];
  const data = fs.readFileSync(archivo, 'utf-8');
  return JSON.parse(data);
}

function guardarPartidas(partidas) {
  fs.writeFileSync(archivo, JSON.stringify(partidas, null, 2));
}

module.exports = { leerPartidas, guardarPartidas };
