const API_PRODUCTOS = "https://techstore-mongodb.onrender.com/productos";
const API_CLIENTES = "https://techstore-mongodb.onrender.com/clientes";
const API_VENTAS = "https://techstore-mongodb.onrender.com/ventas";

let productos = [];
let ventaActual = [];
let total = 0;

async function cargarDatos() {
    const resProductos = await fetch(API_PRODUCTOS);
    productos = await resProductos.json();

    const resClientes = await fetch(API_CLIENTES);
    const clientes = await resClientes.json();

    const selectProducto = document.getElementById("producto");
    const selectCliente = document.getElementById("cliente");

    selectProducto.innerHTML = "";
    selectCliente.innerHTML = "";

    productos.forEach(producto => {
        selectProducto.innerHTML += `
            <option value="${producto._id}">
                ${producto.nombre} - $${producto.precio} - Stock: ${producto.stock}
            </option>
        `;
    });

    clientes.forEach(cliente => {
        selectCliente.innerHTML += `
            <option value="${cliente._id}">
                ${cliente.nombre}
            </option>
        `;
    });

    cargarHistorial();
}

function agregarProductoVenta() {
    const productoId = document.getElementById("producto").value;
    const cantidad = Number(document.getElementById("cantidad").value);

    const producto = productos.find(p => p._id === productoId);

    if (!producto || cantidad <= 0) {
        alert("Selecciona un producto y una cantidad válida");
        return;
    }

    if (cantidad > producto.stock) {
        alert("No hay suficiente stock");
        return;
    }

    const subtotal = producto.precio * cantidad;

    ventaActual.push({
        producto: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
        subtotal: subtotal
    });

    total += subtotal;
    mostrarVentaActual();
}

function mostrarVentaActual() {
    const tabla = document.getElementById("tablaVenta");
    tabla.innerHTML = "";

    ventaActual.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio}</td>
                <td>${item.cantidad}</td>
                <td>$${item.subtotal}</td>
            </tr>
        `;
    });

    document.getElementById("total").textContent = total;
}

async function guardarVenta() {
    const cliente = document.getElementById("cliente").value;

    if (!cliente || ventaActual.length === 0) {
        alert("Selecciona cliente y agrega productos");
        return;
    }

    const venta = {
        cliente: cliente,
        productos: ventaActual.map(item => ({
            producto: item.producto,
            cantidad: item.cantidad
        }))
    };

    const respuesta = await fetch(API_VENTAS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(venta)
    });

    if (respuesta.ok) {
        alert("Venta guardada correctamente");

        ventaActual = [];
        total = 0;

        mostrarVentaActual();
        cargarDatos();
    } else {
        alert("Error al guardar la venta");
    }
}

async function cargarHistorial() {
    const respuesta = await fetch(API_VENTAS);
    const ventas = await respuesta.json();

    const tabla = document.getElementById("tablaHistorial");
    tabla.innerHTML = "";

    ventas.forEach(venta => {
        tabla.innerHTML += `
            <tr>
                <td>${venta.cliente ? venta.cliente.nombre : "Sin cliente"}</td>
                <td>$${venta.total}</td>
                <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            </tr>
        `;
    });
}

function imprimirTicket() {
    const clienteSelect = document.getElementById("cliente");
    const clienteNombre = clienteSelect.options[clienteSelect.selectedIndex].text;

    if (ventaActual.length === 0) {
        alert("Primero agrega productos a la venta");
        return;
    }

    let contenido = `
        <html>
        <head>
            <title>Ticket TechStore</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    width: 300px;
                    margin: auto;
                    padding: 20px;
                }

                h2, h4 {
                    text-align: center;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }

                td {
                    padding: 4px;
                    font-size: 14px;
                }

                .total {
                    font-size: 18px;
                    font-weight: bold;
                    text-align: right;
                    margin-top: 15px;
                }

                .linea {
                    border-top: 1px dashed #000;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <h2>TECHSTORE</h2>
            <h4>Ticket de Venta</h4>

            <div class="linea"></div>

            <p><strong>Cliente:</strong> ${clienteNombre}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>

            <div class="linea"></div>

            <table>
    `;

    ventaActual.forEach(item => {
        contenido += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad} x $${item.precio}</td>
            </tr>
            <tr>
                <td colspan="2">Subtotal: $${item.subtotal}</td>
            </tr>
        `;
    });

    contenido += `
            </table>

            <div class="linea"></div>

            <p class="total">TOTAL: $${total}</p>

            <div class="linea"></div>

            <h4>¡Gracias por su compra!</h4>
        </body>
        </html>
    `;

    const ventana = window.open("", "_blank");
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
}

cargarDatos();