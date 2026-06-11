const API_CLIENTES = "http://localhost:3000/clientes";

async function cargarClientes() {
    const respuesta = await fetch(API_CLIENTES);
    const clientes = await respuesta.json();

    let tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = "";

    clientes.forEach(cliente => {
        tabla.innerHTML += `
            <tr>
                <td>${cliente.nombre}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.correo}</td>
                <td>${cliente.direccion}</td>
                <td>
                    <button class="btn btn-warning btn-sm"
                        onclick="editarCliente('${cliente._id}', '${cliente.nombre}', '${cliente.telefono}', '${cliente.correo}', '${cliente.direccion}')">
                        Editar
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="eliminarCliente('${cliente._id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

async function guardarCliente() {
    const cliente = {
        nombre: document.getElementById("nombre").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        direccion: document.getElementById("direccion").value
    };

    await fetch(API_CLIENTES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });

    limpiarFormulario();
    cargarClientes();
}

function editarCliente(id, nombre, telefono, correo, direccion) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("telefono").value = telefono;
    document.getElementById("correo").value = correo;
    document.getElementById("direccion").value = direccion;

    const boton = document.querySelector("button");
    boton.textContent = "Actualizar Cliente";
    boton.className = "btn btn-primary";
    boton.setAttribute("onclick", `actualizarCliente('${id}')`);
}

async function actualizarCliente(id) {
    const cliente = {
        nombre: document.getElementById("nombre").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        direccion: document.getElementById("direccion").value
    };

    await fetch(`${API_CLIENTES}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });

    limpiarFormulario();

    const boton = document.querySelector("button");
    boton.textContent = "Guardar Cliente";
    boton.className = "btn btn-success";
    boton.setAttribute("onclick", "guardarCliente()");

    cargarClientes();
}

async function eliminarCliente(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este cliente?");

    if (confirmar) {
        await fetch(`${API_CLIENTES}/${id}`, {
            method: "DELETE"
        });

        cargarClientes();
    }
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("direccion").value = "";
}

cargarClientes();