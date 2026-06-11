const express = require('express');
const router = express.Router();

const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

router.get('/stock-bajo', async (req, res) => {
    const productos = await Producto.find({ stock: { $lt: 5 } });
    res.json(productos);
});

router.get('/ventas-mayores', async (req, res) => {
    const ventas = await Venta.find({ total: { $gt: 10000 } }).populate('cliente');
    res.json(ventas);
});

router.get('/total-vendido', async (req, res) => {
    const resultado = await Venta.aggregate([
        {
            $group: {
                _id: null,
                totalVendido: { $sum: "$total" }
            }
        }
    ]);

    res.json(resultado[0] || { totalVendido: 0 });
});

router.get('/inventario', async (req, res) => {
    const productos = await Producto.find();

    const totalProductos = productos.length;

    const productosAgotados = productos.filter(producto => producto.stock === 0).length;

    const valorInventario = productos.reduce((total, producto) => {
        return total + (producto.precio * producto.stock);
    }, 0);

    res.json({
        totalProductos,
        productosAgotados,
        valorInventario
    });
});

router.get('/ventas-hoy', async (req, res) => {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const ventasHoy = await Venta.find({
        fecha: {
            $gte: inicioDia,
            $lte: finDia
        }
    });

    res.json({
        cantidadVentasHoy: ventasHoy.length
    });
});

router.get('/productos-mas-vendidos', async (req, res) => {
    const resultado = await Venta.aggregate([
        { $unwind: "$productos" },
        {
            $group: {
                _id: "$productos.nombre",
                cantidadVendida: { $sum: "$productos.cantidad" },
                totalGenerado: { $sum: "$productos.subtotal" }
            }
        },
        { $sort: { cantidadVendida: -1 } },
        { $limit: 3 }
    ]);

    res.json(resultado);
});

module.exports = router;