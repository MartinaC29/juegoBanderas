const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const preguntas = require('./controllers/preguntas-controllers');

const app = express();
const PORT = process.env.PORT || 3000;

// Cargar países al iniciar
preguntas.cargarPaises();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', apiRoutes);

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})