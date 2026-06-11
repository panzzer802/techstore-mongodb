async function cargarDashboard() {
    const productos = await fetch("https://techstore-mongodb.onrender.com/productos")
        .then(res => res.json());

    const clientes = await fetch("https://techstore-mongodb.onrender.com/clientes")
        .then(res => res.json());

    const ventas = await fetch("https://techstore-mongodb.onrender.com/ventas")
        .then(res => res.json());

    const total = await fetch("https://techstore-mongodb.onrender.com/reportes/total-vendido")
        .then(res => res.json());

    const ventasHoy = await fetch("https://techstore-mongodb.onrender.com/reportes/ventas-hoy")
    .then(res => res.json());
        
    const productosMasVendidos = await fetch("https://techstore-mongodb.onrender.com/reportes/productos-mas-vendidos")
    .then(res => res.json());



    document.getElementById("totalProductos").textContent = productos.length;
    document.getElementById("totalClientes").textContent = clientes.length;
    document.getElementById("totalVentas").textContent = ventas.length;
    document.getElementById("totalVendido").textContent = total.totalVendido;
    document.getElementById("ventasHoy").textContent = ventasHoy.cantidadVentasHoy;
    
    if (productosMasVendidos.length > 0) {
    document.getElementById("productoMasVendido").textContent =
        productosMasVendidos[0]._id;

    document.getElementById("cantidadMasVendida").textContent =
        `${productosMasVendidos[0].cantidadVendida} vendidos`;
}

const tablaTop = document.getElementById("tablaTopProductos");
tablaTop.innerHTML = "";

productosMasVendidos.forEach(producto => {
    tablaTop.innerHTML += `
        <tr>
            <td>${producto._id}</td>
            <td>${producto.cantidadVendida}</td>
            <td>$${producto.totalGenerado}</td>
        </tr>
    `;
});
}

cargarDashboard();