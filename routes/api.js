const express = require('express');
const router = express.Router();
const { obtenerPregunta, guardarPartida, obtenerRanking } = require('../controllers/preguntas-controllers.js');

// Ruta para traer una pregunta
router.get('/pregunta', obtenerPregunta);

// Ruta para guardar una partida terminada
router.post('/partida', guardarPartida);

// Ruta para obtener el ranking
router.get('/ranking', obtenerRanking);

module.exports = router;