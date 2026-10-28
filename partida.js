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
  return f.getDate() + "/" + f.getMonth() + "/" + f.getYear();
}

// Las partidas se guardan en una cookie como un array en JSON.
function cargarPartidas() {
  const datos = leerCookie("partidas", []);
  return datos;
}

function guardarPartida(partida) {
  const partidas = cargarPartidas();
  partidas.push(partida);
  guardarCookie("partidas", partidas.slice(0, 5), 30);   // solo las 5 últimas
}

function mediaPuntos(partidas) {
  if (partidas.length === 0) return 0;
  return partidas.reduce((suma, p) => suma + p.puntos) / partidas.length;
}