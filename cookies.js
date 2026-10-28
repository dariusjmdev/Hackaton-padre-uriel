// Funciones para guardar, leer y borrar cookies con valores JSON.
// Todas las cookies de este proyecto empiezan por "quiz_".
const PREFIJO = "quiz_";

function guardarCookie(nombre, valor, dias) {
  const segundos = dias * 24 * 60;
  const texto = JSON.stringify(valor);
  document.cookie = PREFIJO + nombre + "=" + texto + "; max-age=" + segundos + "; path=/";
}

function leerCookie(nombre, porDefecto) {
  const clave = PREFIJO + nombre + "=";
  const trozo = document.cookie.split("; ").find(c => c.startsWith(clave));
  if (!trozo) return porDefecto;
  return JSON.parse(trozo.slice(clave.length));
}

function borrarCookie(nombre) {
  document.cookie = PREFIJO + nombre + "=; max-age=0; path=/quiz";
}