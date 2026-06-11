const express = require('express');
const router = express.Router();

const Cliente = require('../models/Cliente');

router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const cliente = new Cliente({
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion
        });

        const nuevo = await cliente.save();
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(cliente);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Cliente eliminado" });
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;