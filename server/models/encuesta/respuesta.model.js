const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'respuesta'
};

let respuestaSchema = new mongoose.Schema({
    strRespuesta: {
        type: String,
        required: [true, 'Favor de ingresar el nombre de la respuesta.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

module.exports = mongoose.model('respuesta', respuestaSchema);