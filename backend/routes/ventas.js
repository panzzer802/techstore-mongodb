const express = require('express');
const router = express.Router();

const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

router.get('/', async (req, res) => {
    try {
        const ventas = await Venta.find()
            .populate('cliente')
            .populate('productos.producto');

        res.json(ventas);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        let total = 0;
        let productosVenta = [];

        for (const item of req.body.productos) {
            const producto = await Producto.findById(item.producto);

            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            if (producto.stock < item.cantidad) {
                return res.status(400).json({ mensaje: `Stock insuficiente para ${producto.nombre}` });
            }

            const subtotal = producto.precio * item.cantidad;

            productosVenta.push({
                producto: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: item.cantidad,
                subtotal: subtotal
            });

            total += subtotal;

            producto.stock -= item.cantidad;
            await producto.save();
        }

        const venta = new Venta({
            cliente: req.body.cliente,
            productos: productosVenta,
            total: total
        });

        const nuevaVenta = await venta.save();

        res.status(201).json(nuevaVenta);

    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;