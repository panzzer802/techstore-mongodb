const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String
    },
    correo: {
        type: String
    },
    direccion: {
        type: String
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cliente', clienteSchema);