const fetch = require('node-fetch');

// Obtener una pregunta aleatoria
async function obtenerPregunta(req, res) {
  try {
    const respuesta = await fetch('https://restcountries.com/v3.1/all');
    const paises = await respuesta.json();

    const tipos = ["capital", "bandera", "fronteras"];

    for (let i = 0; i < 10; i++) {
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const pais = paises[Math.floor(Math.random() * paises.length)];

      let pregunta = null;

      if (tipo === "capital" && pais.capital && pais.capital.length > 0) {
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
      } else if (tipo === "fronteras" && pais.borders && pais.borders.length > 0) {
        pregunta = {
          tipo: "fronteras",
          pregunta: `¿Cuántos países limítrofes tiene ${pais.name.common}?`,
          respuesta: pais.borders.length.toString()
        };
      }

      if (pregunta) {
        return res.json(pregunta);
      }
    }

    res.status(500).json({ error: 'No se pudo generar una pregunta válida' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pregunta' });
  }
}

// Guardar partida en un array (puede ser reemplazado por una base de datos)
let partidas = [];

function guardarPartida(req, res) {
  const { jugador, puntaje, correctas, incorrectas, tiempoTotal } = req.body;

  if (!jugador || puntaje === undefined) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const nuevaPartida = {
    jugador,
    puntaje,
    correctas,
    incorrectas,
    tiempoTotal,
    fecha: new Date().toISOString()
  };

  partidas.push(nuevaPartida);
  res.status(201).json({ mensaje: 'Partida guardada correctamente' });
}

// Obtener el ranking (ordenado por puntaje descendente)
function obtenerRanking(req, res) {
  const ranking = [...partidas].sort((a, b) => b.puntaje - a.puntaje);
  res.json(ranking);
}

module.exports = { obtenerPregunta, guardarPartida, obtenerRanking };
