const mongoose = require('mongoose');
let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'pregunta'
};
let preguntaSchema = new mongoose.Schema({
    strPregunta: {
        type: String,
        required: [true, 'Favor de ingresar el nombre de la pregunta.']
    },
    arrIdRespuesta: [{
        type: mongoose.Types.ObjectId,
        ref: 'respuesta'
    }],
    blnActivo: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

module.exports = mongoose.model('pregunta', preguntaSchema);