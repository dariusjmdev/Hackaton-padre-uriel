// QuizDAW · lógica de la página
let usuario = null;
let preguntas = [];
let indice = 0;
let puntos = 0;
let inicio = 0;
let respondida = false;
let rachaActual = 0;
let mejorRacha = 0;

/* ---------- Usuario y apariencia ---------- */
function pedirNombre() {
  // Error 1 corregido: Cancelar prompt devuelve null; se usa una cadena vacía para evitar llamar trim() sobre null.
  return (prompt("¿Cómo te llamas?") || "").trim() || "invitado";
}

function aplicarTema() {
  // Error 2 corregido: classList modifica la clase CSS del body; asignar body.class no la aplicaba.
  document.body.classList.toggle("oscuro", usuario.tema === "oscuro");
}

function cambiarTema() {
  usuario.tema = usuario.tema === "oscuro" ? "claro" : "oscuro";
  guardarCookie("usuario", usuario, 30);
  aplicarTema();
}

/* ---------- Datos del navegador ---------- */
function datosDelNavegador() {
  return {
    // Error 3 corregido: el tamaño de la ventana se obtiene de window, no de document.
    ventana: window.innerWidth + " × " + window.innerHeight,
    idioma: navigator.language,
    // Error 4 corregido: el título de la pestaña está en document.title.
    pagina: document.title,
    ruta: location.pathname
  };
}

function pintarInfo() {
  const d = datosDelNavegador();
  document.getElementById("info").textContent =
    "Ventana: " + d.ventana + " · Idioma: " + d.idioma + " · Página: " + d.pagina + " · Ruta: " + d.ruta;
}

/* ---------- Preguntas al azar ---------- */
function elegirPreguntas(todas, cuantas) {
  const disponibles = [...todas];
  const elegidas = [];
  while (elegidas.length < Math.min(cuantas, todas.length)) {
    // Error 5 corregido: los índices empiezan en cero; sumar 1 podía extraer undefined.
    const posicion = Math.floor(Math.random() * disponibles.length);
    elegidas.push(disponibles.splice(posicion, 1)[0]);
  }
  return elegidas;
}

/* ---------- La partida ---------- */
function mostrarSeccion(id, visible) {
  document.getElementById(id).hidden = !visible;
}

function iniciarPartida() {
  preguntas = elegirPreguntas(PREGUNTAS, 5);
  indice = 0;
  puntos = 0;
  // La racha y el récord se conservan entre partidas; solo una respuesta incorrecta rompe la racha.
  inicio = Date.now();
  pintarRacha();
  mostrarSeccion("inicio", false);
  mostrarSeccion("final", false);
  mostrarSeccion("juego", true);
  mostrarPregunta();
}

function mostrarPregunta() {
  const q = preguntas[indice];
  respondida = false;
  document.title = "QuizDAW · " + (indice + 1) + "/" + preguntas.length;
  document.getElementById("textoPregunta").textContent = (indice + 1) + "/" + preguntas.length + " · " + q.pregunta;

  const contenedor = document.getElementById("opciones");
  contenedor.innerHTML = "";
  q.opciones.forEach((texto, i) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = texto;
    boton.dataset.i = i;
    contenedor.appendChild(boton);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("btnSiguiente").hidden = true;
  document.getElementById("marcador").textContent = "Puntos: " + puntos;
}

function manejarOpcion(evento) {
  const dato = evento.target.dataset.i;
  if (dato === undefined || respondida) return;
  responder(dato);
}

function pintarRacha() {
  document.getElementById("rachaActual").textContent = rachaActual;
  document.getElementById("mejorRacha").textContent = mejorRacha;
  // El estilo destacado se activa cuando el jugador consigue al menos dos aciertos seguidos.
  document.getElementById("btnRacha").classList.toggle("racha-activa", rachaActual >= 2);
}

function alternarDetalleRacha() {
  const boton = document.getElementById("btnRacha");
  const detalle = document.getElementById("detalleRacha");
  detalle.hidden = !detalle.hidden;
  boton.setAttribute("aria-expanded", String(!detalle.hidden));
}

function responder(i) {
  respondida = true;
  const q = preguntas[indice];
  const botones = document.getElementById("opciones").children;
  // Error 6 corregido: dataset.i es texto y correcta es número; se convierten al mismo tipo antes de comparar.
  i = Number(i);
  const acierto = i === q.correcta;
  if (acierto) {
    puntos++;
    rachaActual++;
    mejorRacha = Math.max(mejorRacha, rachaActual);
  } else {
    rachaActual = 0;
  }
  pintarRacha();

  botones[q.correcta].className = "opcion ok";
  if (!acierto) botones[i].className = "opcion mal";
  document.getElementById("feedback").textContent =
    acierto ? "¡Correcto!" : "Incorrecto. La respuesta era: " + q.opciones[q.correcta];
  document.getElementById("marcador").textContent = "Puntos: " + puntos;

  const siguiente = document.getElementById("btnSiguiente");
  siguiente.textContent = indice === preguntas.length - 1 ? "Ver resultado" : "Siguiente";
  siguiente.hidden = false;
}

function siguiente() {
  indice++;
  if (indice < preguntas.length) mostrarPregunta();
  else terminar();
}

function terminar() {
  const segundos = Math.round((Date.now() - inicio) / 1000);
  const partida = new Partida(usuario.nombre, puntos, preguntas.length, new Date().toISOString(), segundos);
  guardarPartida(partida);

  mostrarSeccion("juego", false);
  mostrarSeccion("final", true);
  document.title = "QuizDAW";
  // Se añade el mejor tramo de aciertos seguidos al resumen de la partida.
  document.getElementById("textoFinal").textContent =
    partida.resumen() + " · Mejor racha: " + mejorRacha;
  pintarPartidas();
}

/* ---------- Lista de partidas y ventana de resultados ---------- */
function pintarPartidas() {
  const partidas = cargarPartidas();
  const lista = document.getElementById("listaPartidas");
  lista.innerHTML = "";
  for (const p of partidas) {
    const li = document.createElement("li");
    li.textContent = p.resumen();
    lista.appendChild(li);
  }
  document.getElementById("media").textContent =
    partidas.length > 0 ? "Media: " + mediaPuntos(partidas).toFixed(1) + " puntos" : "Aún no hay partidas.";
}

function abrirResultados() {
  // Error 7 corregido: el archivo de la ventana se llama resultados.html.
  window.open("resultados.html", "resultados", "popup=yes,width=520,height=460");
}

function manejarBorrar() {
  if (confirm("¿Borrar todos tus datos del quiz?")) {
    borrarCookie("usuario");
    borrarCookie("partidas");
    pintarPartidas();
    document.getElementById("saludo").textContent = "Datos borrados. Recarga la página.";
  }
}

/* ---------- Arranque ---------- */
function iniciar() {
  usuario = leerCookie("usuario", null);
  if (usuario === null) {
    usuario = { nombre: pedirNombre(), tema: "claro" };
    guardarCookie("usuario", usuario, 30);
  }
  document.getElementById("saludo").textContent = "Hola, " + usuario.nombre;
  aplicarTema();
  pintarPartidas();
  pintarInfo();

  document.getElementById("btnEmpezar").addEventListener("click", iniciarPartida);
  document.getElementById("btnOtra").addEventListener("click", iniciarPartida);
  document.getElementById("btnSiguiente").addEventListener("click", siguiente);
  document.getElementById("opciones").addEventListener("click", manejarOpcion);
  document.getElementById("btnTema").addEventListener("click", cambiarTema);
  // Error 8 corregido: se pasa el manejador, no se ejecuta al cargar la página.
  document.getElementById("btnResultados").addEventListener("click", abrirResultados);
  document.getElementById("btnBorrar").addEventListener("click", manejarBorrar);
  document.getElementById("btnRacha").addEventListener("click", alternarDetalleRacha);
}
document.addEventListener("DOMContentLoaded", iniciar);