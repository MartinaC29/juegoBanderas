const { leerPartidas, guardarPartidas } = require('../utils/archivo');

// Obtener una pregunta aleatoria
async function obtenerPregunta(req, res) {
  try {
    const respuesta = await fetch('https://restcountries.com/v3.1/all');
    const paises = await respuesta.json();

    console.log('Paises obtenidos:', paises);  // Ver los datos obtenidos

    const tiposDisponibles = [];

    const paisesConCapital = paises.filter(p => p.capital?.length && p.name?.common);
    const paisesConBandera = paises.filter(p => p.flags?.png && p.name?.common);
    const paisesConFronteras = paises.filter(p => p.borders?.length && p.name?.common);    

    if (paisesConCapital.length) tiposDisponibles.push('capital');
    if (paisesConBandera.length) tiposDisponibles.push('bandera');
    if (paisesConFronteras.length) tiposDisponibles.push('fronteras');

    if (tiposDisponibles.length === 0) {
      return res.status(500).json({ error: 'No hay suficientes datos para generar preguntas' });
    }

    const tipo = tiposDisponibles[Math.floor(Math.random() * tiposDisponibles.length)];
    let pregunta;

    if (tipo === 'capital') {
      const pais = paisesConCapital[Math.floor(Math.random() * paisesConCapital.length)];
      pregunta = {
        tipo: 'capital',
        pregunta: `¿De qué país es la capital ${pais.capital[0]}?`,
        respuesta: pais.name.common
      };
    } else if (tipo === 'bandera') {
      const pais = paisesConBandera[Math.floor(Math.random() * paisesConBandera.length)];
      pregunta = {
        tipo: 'bandera',
        pregunta: `¿A qué país pertenece esta bandera?`,
        bandera: pais.flags.png,
        respuesta: pais.name.common
      };
    } else if (tipo === 'fronteras') {
      const pais = paisesConFronteras[Math.floor(Math.random() * paisesConFronteras.length)];
      pregunta = {
        tipo: 'fronteras',
        pregunta: `¿Cuántos países limítrofes tiene ${pais.name.common}?`,
        respuesta: pais.borders.length.toString()
      };
    }

    res.json(pregunta);

  } catch (error) {
    console.error("Error al obtener pregunta:", error);
    res.status(500).json({ error: 'Error al obtener pregunta' });
  }
}

// Guardar una nueva partida
function guardarPartida(req, res) {
  const { jugador, puntaje, correctas, incorrectas, tiempoTotal } = req.body;

  if (!jugador || typeof puntaje !== 'number') {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  const nuevaPartida = {
    jugador,
    puntaje,
    correctas: correctas ?? 0,
    incorrectas: incorrectas ?? 0,
    tiempoTotal: tiempoTotal ?? "0.00",
    fecha: new Date().toISOString()
  };

  try {
    const partidas = leerPartidas(); // leer siempre actualizado
    partidas.push(nuevaPartida);
    guardarPartidas(partidas);
    res.status(201).json({ mensaje: 'Partida guardada correctamente' });
  } catch (error) {
    console.error("Error al guardar partida:", error);
    res.status(500).json({ error: 'No se pudo guardar la partida' });
  }
}

// Obtener el ranking (ordenado por puntaje descendente)
function obtenerRanking(req, res) {
  const partidas = leerPartidas(); // leer siempre actualizado
  const ranking = [...partidas].sort((a, b) => b.puntaje - a.puntaje);
  res.json(ranking);
}

module.exports = { obtenerPregunta, guardarPartida, obtenerRanking };
