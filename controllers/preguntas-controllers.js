const fetch = require('node-fetch'); // Importar fetch en Node

// Obtener una pregunta aleatoria
async function obtenerPregunta(req, res) {
  try {
    const respuesta = await fetch('https://restcountries.com/v3.1/all');
    const paises = await respuesta.json(); // Parsear el JSON directamente

    // Resto de la lógica igual
    const tipos = ["capital", "bandera", "fronteras"];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const pais = paises[Math.floor(Math.random() * paises.length)];

    let pregunta = {};
    if (tipo === "capital" && pais.capital) {
      pregunta = {
        tipo: "capital",
        pregunta: `¿De qué país es capital ${pais.capital[0]}?`,
        respuesta: pais.name.common
      };
    } else if (tipo === "bandera" && pais.flags && pais.flags.png) {
      pregunta = {
        tipo: "bandera",
        pregunta: `¿A qué país pertenece esta bandera?`,
        bandera: pais.flags.png,
        respuesta: pais.name.common
      };
    } else if (tipo === "fronteras" && pais.borders) {
      pregunta = {
        tipo: "fronteras",
        pregunta: `¿Cuántos países limítrofes tiene ${pais.name.common}?`,
        respuesta: pais.borders.length.toString()
      };
    } else {
      return obtenerPregunta(req, res); // Si no tiene info, intentar otra
    }

    res.json(pregunta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pregunta' });
  }
}

module.exports = { obtenerPregunta, guardarPartida, obtenerRanking };