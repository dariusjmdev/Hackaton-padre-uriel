// Funciones para guardar, leer y borrar cookies con valores JSON.
// Todas las cookies de este proyecto empiezan por "quiz_".
const PREFIJO = "quiz_";

function guardarCookie(nombre, valor, dias) {
  // Error 9 corregido: max-age usa segundos (no minutos) y el JSON se codifica para guardar caracteres especiales.
  const segundos = dias * 24 * 60 * 60;
  const texto = encodeURIComponent(JSON.stringify(valor));
  document.cookie = PREFIJO + nombre + "=" + texto + "; max-age=" + segundos + "; path=/";
}

function leerCookie(nombre, porDefecto) {
  const clave = PREFIJO + nombre + "=";
  const trozo = document.cookie.split(/;\s*/).find(c => c.startsWith(clave));
  if (!trozo) return porDefecto;
  // Error 10 corregido: se decodifica el valor antes de convertirlo desde JSON.
  return JSON.parse(decodeURIComponent(trozo.slice(clave.length)));
}

function borrarCookie(nombre) {
  // Error 11 corregido: la ruta debe coincidir con path=/ usado al crear la cookie.
  document.cookie = PREFIJO + nombre + "=; max-age=0; path=/";
}