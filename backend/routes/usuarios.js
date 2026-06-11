const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');

router.post('/registro', async (req, res) => {
    try {
        const usuarioExiste = await Usuario.findOne({
            correo: req.body.correo
        });

        if (usuarioExiste) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const usuario = new Usuario({
            nombre: req.body.nombre,
            correo: req.body.correo,
            password: passwordHash
        });

        const nuevoUsuario = await usuario.save();

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: nuevoUsuario
        });

    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            correo: req.body.correo
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
                req.body.password,
                usuario.password
            );

            if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        res.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;