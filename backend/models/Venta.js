const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            nombre: String,
            precio: Number,
            cantidad: Number,
            subtotal: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Venta', ventaSchema);