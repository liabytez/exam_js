"use strict"
/*
vaya fumada hacer esto en dos horas profe :(
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
*/

// importamos el array con todos los hiraganas
import {
    datos
} from "./datos.js"

// VARIABLES PRINCIPALES DEL JUEGO

// aqui guardaremos las 10 imágenes que usara la partida
let listaJuego = []

// indica en que imagen estamos actualmente
let indiceActual = 0

// guarda todas las respuestas del usuario (para la tabla)
let listaRomanji = []

// variables del resumen del juego
let aciertos = 0
let fallos = 0
let intentos = 0

// FUNCION PARA GENERAR 10 HIRAGANAS ALEATORIOS

function generarListaAleatoria() {

    // copiamos el array original para no modificarlo
    let copiaDatos = [...datos]

    // mezclamos el array usando sort y Math.random()
    copiaDatos.sort(() => Math.random() - 0.5)

    // tomamos los primeros 10 despues de mezclar
    listaJuego = copiaDatos.slice(0, 10)
}

// FUNCION PARA INICIAR EL JUEGO

function iniciarJuego() {

    // generamos los 10 hiraganas aleatorios
    generarListaAleatoria()

    // reiniciamos todas las variables
    indiceActual = 0
    listaRomanji = []
    aciertos = 0
    fallos = 0
    intentos = 0

    // mostramos la primera imagen
    mostrarImagen()

    // actualizamos los contadores
    actualizarResumen()

    // limpiamos la tabla
    renderizarTabla()

    // borramos mensaje final si lo habia
    document.getElementById("mensajeTerminado").textContent = ""
}

// MOSTRAR LA IMAGEN ACTUAL

function mostrarImagen() {

    // si ya terminamos todas las imágenes
    if (indiceActual >= listaJuego.length) {

        // mostramos imagen final
        document.getElementById("imagen").src = "assets/terminado.jpg"

        // mostramos mensaje final
        document.getElementById("mensajeTerminado").textContent =
            "Juego terminado, dale a resetear"

        return
    }

    // si aun quedan imágenes, mostramos la actual
    document.getElementById("imagen").src = listaJuego[indiceActual].url

    // actualizamos el contador de progreso
    actualizarContador()
}


/*
   ACTUALIZAR TEXTO DEL CONTADOR
   imagen 1 de 10, etc...
*/

function actualizarContador() {

    const texto = `Imagen ${indiceActual + 1} de ${listaJuego.length}`

    document.getElementById("contador").textContent = texto
}

// COMPROBAR RESPUESTA DEL USUARIO

function comprobarRespuesta() {

    const input = document.getElementById("respuesta")

    // convertimos la respuesta a minúsculas
    // y quitamos espacios
    const respuestaUsuario = input.value.toLowerCase().trim()

    // si el juego ya termino no hacemos nada
    if (indiceActual >= listaJuego.length) return

    // obtenemos la respuesta correcta
    const correcta = listaJuego[indiceActual].name

    // cada vez que el usuario responde aumenta intentos
    intentos++

    // comparamos respuesta
    if (respuestaUsuario === correcta) {
        // si acierta
        aciertos++

        // guardamos respuesta en historial
        listaRomanji.push({
            respuesta: respuestaUsuario,
            correcta: true
        })

        // avanzamos a la siguiente imagen
        indiceActual++

    } else {
        // si falla
        fallos++

        // guardamos el fallo
        listaRomanji.push({
            respuesta: respuestaUsuario,
            correcta: false
        })
    }

    // guardamos progreso en localStorage
    guardarProgreso()

    // actualizamos tabla e indicadores
    renderizarTabla()
    actualizarResumen()

    // mostramos la imagen correspondiente
    mostrarImagen()

    // limpiamos el input
    input.value = ""
}

// RENDERIZAR TABLA DE HISTORIAL

function renderizarTabla() {

    const tbody =
        document.getElementById("tbodyRespuestas")

    // limpiamos contenido anterior
    tbody.innerHTML = ""

    // si aun no hay respuestas
    if (listaRomanji.length === 0) {
        const tr = document.createElement("tr")

        tr.innerHTML = "<td colspan='3'>Todavía no hay respuestas registradas</td>"

        tbody.appendChild(tr)
        return
    }

    // recorremos todas las respuestas
    listaRomanji.forEach((item, index) => {

        const tr = document.createElement("tr")

        // texto según si acerto o fallo
        const resultado =
            item.correcta
                ? "Correcto"
                : "Incorrecto"

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.respuesta}</td>
            <td>${resultado}</td>
        `

        tbody.appendChild(tr)
    })
}

// ACTUALIZAR TARJETAS DEL RESUMEN

function actualizarResumen() {

    // pendientes = total - aciertos
    const pendientes = listaJuego.length - aciertos

    document.getElementById("aciertos").textContent = aciertos
    document.getElementById("fallos").textContent = fallos
    document.getElementById("intentos").textContent = intentos
    document.getElementById("pendientes").textContent = pendientes
}

// GUARDAR PROGRESO EN LOCALSTORAGE

function guardarProgreso() {

    // solo guardamos si ya hubo intentos
    if (intentos > 0) {

        const progreso = {
            listaJuego,
            indiceActual,
            aciertos,
            fallos,
            intentos,
            listaRomanji
        }

        localStorage.setItem("hiraganaGame", JSON.stringify(progreso))
    }
}

// CARGAR PROGRESO SI EXISTE

function cargarProgreso() {

    const data = localStorage.getItem("hiraganaGame")

    // si no hay progreso guardado
    if (!data) {
        iniciarJuego()
        return
    }

    // convertimos texto a objeto
    const progreso = JSON.parse(data)

    // recuperamos valores guardados
    listaJuego = progreso.listaJuego
    indiceActual = progreso.indiceActual
    aciertos = progreso.aciertos
    fallos = progreso.fallos
    intentos = progreso.intentos
    listaRomanji = progreso.listRomanji

    // mostramos estado actual del juego
    mostrarImagen()
    renderizarTabla()
    actualizarResumen()
}

// RESET DEL JUEGO

function resetJuego() {
    // borramos progreso guardado
    localStorage.removeItem("hiraganaGame")

    // reiniciamos todo
    iniciarJuego()
}

// EVENTOS

// Botón reset
document.getElementById("btnResetear").addEventListener("click", resetJuego)

// Capturamos el submit del formulario, para evitar que recargue la página
document.getElementById("form")
    .addEventListener("submit", function (e) {
        e.preventDefault()
        comprobarRespuesta()
    })

// INICIAR JUEGO AL CARGAR LA PÁGINA
cargarProgreso()