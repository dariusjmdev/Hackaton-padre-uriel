// Una partida jugada: quién, cuántos puntos, cuándo y cuánto tardó.
class Partida {
  constructor(nombre, puntos, total, fecha, segundos) {
    this.nombre = nombre;
    this.puntos = puntos;
    this.total = total;
    this.fecha = fecha;          // texto en formato ISO, por ejemplo "2026-03-15T12:00:00.000Z"
    this.segundos = segundos;
  }

  porcentaje() {
    return Math.round(this.puntos / this.total * 100);
  }

  resumen() {
    return this.nombre + ": " + this.puntos + "/" + this.total + " (" + this.porcentaje() + " %) · " +
           formatearFecha(this.fecha) + " · " + this.segundos + " s";
  }
}

function formatearFecha(textoISO) {
  const f = new Date(textoISO);
  // Error 12 corregido: getMonth empieza en cero y getYear no devuelve el año completo.
  return f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
}

// Las partidas se guardan en una cookie como un array en JSON.
function cargarPartidas() {
  const datos = leerCookie("partidas", []);
  // Error 13 corregido: JSON no conserva métodos; se recrean objetos Partida para usar resumen() y porcentaje().
  return datos.map(p => new Partida(p.nombre, p.puntos, p.total, p.fecha, p.segundos));
}

function guardarPartida(partida) {
  const partidas = cargarPartidas();
  partidas.push(partida);
  guardarCookie("partidas", partidas.slice(0, 5), 30);   // solo las 5 últimas
}

function mediaPuntos(partidas) {
  // Error corregido: se excluyen puntuaciones ausentes o no numéricas para que datos antiguos no conviertan la media en NaN.
  const puntosValidos = partidas
    .filter(p => p && p.puntos !== null && p.puntos !== "" && Number.isFinite(Number(p.puntos)))
    .map(p => Number(p.puntos));
  if (puntosValidos.length === 0) return 0;
  return puntosValidos.reduce((suma, puntos) => suma + puntos, 0) / puntosValidos.length;
}