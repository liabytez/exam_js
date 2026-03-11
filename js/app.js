"use strict"

import {
    datos
} from "./datos.js"

let listRomanji = []

function renderizarTabla() {
    const tbody = document.querySelector("#tbodyRespuestas")
    tbody.innerHTML = ""

    if (listRomanji.length === 0) {
        const tr = document.createElement("tr")
        tr.innerHTML = "<td colspan='3'>Todavía no hay respuestas registradas</td>"
        tbody.appendChild(tr)
        return
    }
}

renderizarTabla()

function resetForm() {
    const formulario = document.getElementById("form")
    const inputRespuesta = document.getElementById("respuesta")
    inputRespuesta.value = ""
    formulario.reset()
}

document.getElementById("btnResetear").addEventListener("click", 
    () => {
        resetForm()
    }
)