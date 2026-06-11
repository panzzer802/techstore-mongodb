const API = "https://techstore-mongodb.onrender.com/productos";

async function cargarProductos() {
    const respuesta = await fetch(API);
    const productos = await respuesta.json();

    let tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    productos.forEach(producto => {
        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.categoria}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto('${producto._id}', '${producto.nombre}', '${producto.descripcion}', ${producto.precio}, ${producto.stock}, '${producto.categoria}')">
                        Editar
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto._id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

async function guardarProducto() {
    const producto = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: Number(document.getElementById("precio").value),
        stock: Number(document.getElementById("stock").value),
        categoria: document.getElementById("categoria").value
    };

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    limpiarFormulario();
    cargarProductos();
}

async function eliminarProducto(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este producto?");

    if (confirmar) {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        cargarProductos();
    }
}

function editarProducto(id, nombre, descripcion, precio, stock, categoria) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("descripcion").value = descripcion;
    document.getElementById("precio").value = precio;
    document.getElementById("stock").value = stock;
    document.getElementById("categoria").value = categoria;

    const boton = document.querySelector("button");
    boton.textContent = "Actualizar Producto";
    boton.className = "btn btn-primary";
    boton.setAttribute("onclick", `actualizarProducto('${id}')`);
}

async function actualizarProducto(id) {
    const producto = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: Number(document.getElementById("precio").value),
        stock: Number(document.getElementById("stock").value),
        categoria: document.getElementById("categoria").value
    };

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    limpiarFormulario();

    const boton = document.querySelector("button");
    boton.textContent = "Guardar Producto";
    boton.className = "btn btn-success";
    boton.setAttribute("onclick", "guardarProducto()");

    cargarProductos();
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("categoria").value = "";
}

cargarProductos();