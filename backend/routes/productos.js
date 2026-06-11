const express = require('express');
const router = express.Router();

const Producto = require('../models/Producto');


// CONSULTAR TODOS

router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json(error);
    }
});


// REGISTRAR PRODUCTO

router.post('/', async (req, res) => {
    try {

        const producto = new Producto({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            stock: req.body.stock,
            categoria: req.body.categoria
        });

        const nuevo = await producto.save();

        res.status(201).json(nuevo);

    } catch (error) {
        res.status(400).json(error);
    }
});


// ACTUALIZAR PRODUCTO

router.put('/:id', async (req, res) => {

    try {

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(producto);

    } catch (error) {

        res.status(400).json(error);

    }

});


// ELIMINAR PRODUCTO

router.delete('/:id', async (req, res) => {

    try {

        await Producto.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Producto eliminado"
        });

    } catch (error) {

        res.status(400).json(error);

    }

});

module.exports = router;