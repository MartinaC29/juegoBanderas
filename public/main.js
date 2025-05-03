const preguntaEl = document.getElementById('pregunta');
const opcionesEl = document.getElementById('opciones');
const feedbackEl = document.getElementById('feedback');
const contadorEl = document.getElementById('contador');
const puntajeEl = document.getElementById('puntaje');

let preguntaActual = {};
let preguntasRespondidas = 0;
let puntaje = 0;
let correctas = 0;
let incorrectas = 0;
let tiempoInicioPregunta;
let tiemposPorPregunta = [];

// Saludo con el nombre del jugador
const playerName = localStorage.getItem('playerName') || 'Jugador';
const greetingEl = document.getElementById('greeting');
if (greetingEl) {
  greetingEl.innerText = `¡Hola, ${playerName}!`;
}

// Iniciar primer pregunta
nuevaPregunta();


// FUNCIONES


async function nuevaPregunta() {
  try {
    const res = await fetch('/api/pregunta');
    preguntaActual = await res.json();
    mostrarPregunta();
    tiempoInicioPregunta = Date.now(); // Marcar el inicio del tiempo
  } catch (error) {
    console.error('Error al obtener la pregunta', error);
  }
}

function mostrarPregunta() {
  opcionesEl.innerHTML = '';
  feedbackEl.innerText = '';
  preguntaEl.classList.remove("fade-in");
  void preguntaEl.offsetWidth;

  if (preguntaActual.tipo === 'bandera' && preguntaActual.bandera) {
    preguntaEl.innerHTML = `
  <div class="flex flex-col items-center mb-4">
    <img src="${preguntaActual.bandera}" 
         alt="Bandera" 
         class="w-48 h-32 object-cover rounded-2xl shadow-lg border-4 border-purple-500" />
  </div>
  <p>${preguntaActual.pregunta}</p>`;
  
  } else {
    preguntaEl.innerText = preguntaActual.pregunta;
  }

  preguntaEl.classList.add("fade-in");

  // Crear 3 opciones incorrectas + 1 correcta
  const opciones = [preguntaActual.respuesta];
  while (opciones.length < 4) {
    const randomPais = paisRandom();
    if (!opciones.includes(randomPais)) {
      opciones.push(randomPais);
    }
  }
  opciones.sort(() => Math.random() - 0.5); // Mezclar opciones

  opciones.forEach(opcion => {
    const button = document.createElement('button');
    button.innerText = opcion;
    button.className = 'block w-full p-2 border rounded bg-gray-100 hover:bg-gray-200';
    button.onclick = () => verificarRespuesta(opcion);
    opcionesEl.appendChild(button);
  });
}

async function paisRandom() {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const paises = await res.json();
  const random = paises[Math.floor(Math.random() * paises.length)];
  return random.name.common;
}

function verificarRespuesta(opcionSeleccionada) {
  const tiempoFin = Date.now();
  const tiempoRespuesta = (tiempoFin - tiempoInicioPregunta) / 1000; // en segundos
  tiemposPorPregunta.push(tiempoRespuesta);

  if (opcionSeleccionada === preguntaActual.respuesta) {
    feedbackEl.innerText = "✅ ¡Correcto!";
    puntaje += (preguntaActual.tipo === "bandera") ? 5 : 3;
    correctas++;
  } else {
    feedbackEl.innerText = `❌ Incorrecto. La respuesta era: ${preguntaActual.respuesta}`;
    incorrectas++;
  }

  preguntasRespondidas++;
  actualizarContador();

  setTimeout(() => {
    if (preguntasRespondidas >= 10) {
      finalizarJuego();
    } else {
      nuevaPregunta();
    }
  }, 1500);
}

function actualizarContador() {
  contadorEl.innerText = preguntasRespondidas;
  puntajeEl.innerText = puntaje;
}

function finalizarJuego() {
  const tiempoTotal = tiemposPorPregunta.reduce((a, b) => a + b, 0);
  const tiempoPromedio = tiempoTotal / tiemposPorPregunta.length;

  // Guardar en localStorage
  localStorage.setItem('correctas', correctas);
  localStorage.setItem('incorrectas', incorrectas);
  localStorage.setItem('tiempoTotal', `${tiempoTotal.toFixed(2)}s`);
  localStorage.setItem('tiempoPromedio', `${tiempoPromedio.toFixed(2)}s`);

  // Enviar partida al servidor
  fetch('/api/partida', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jugador: playerName,
      puntaje: puntaje,
      correctas: correctas,
      incorrectas: incorrectas,
      tiempoTotal: tiempoTotal.toFixed(2)
    })
  });

  // animación de salida
  const contenedor = document.getElementById("juego"); // o el div principal del juego
  contenedor.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = '/resultados.html';
  }, 500);
}
