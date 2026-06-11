const API_REPORTES = "https://techstore-mongodb.onrender.com/reportes";

async function cargarTotalVendido() {
    const respuesta = await fetch(`${API_REPORTES}/total-vendido`);
    const data = await respuesta.json();

    document.getElementById("totalVendido").textContent = data.totalVendido;
}

async function cargarStockBajo() {
    const respuesta = await fetch(`${API_REPORTES}/stock-bajo`);
    const productos = await respuesta.json();

    const tabla = document.getElementById("tablaStockBajo");
    tabla.innerHTML = "";

    productos.forEach(producto => {
        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.stock}</td>
                <td>$${producto.precio}</td>
                <td>${producto.categoria}</td>
            </tr>
        `;
    });
}

async function cargarVentasMayores() {
    const respuesta = await fetch(`${API_REPORTES}/ventas-mayores`);
    const ventas = await respuesta.json();

    const tabla = document.getElementById("tablaVentasMayores");
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

async function cargarInventario() {
    const respuesta = await fetch(`${API_REPORTES}/inventario`);
    const data = await respuesta.json();

    document.getElementById("totalProductos").textContent = data.totalProductos;
    document.getElementById("productosAgotados").textContent = data.productosAgotados;
    document.getElementById("valorInventario").textContent = data.valorInventario;
}

cargarTotalVendido();
cargarStockBajo();
cargarVentasMayores();
cargarInventario();