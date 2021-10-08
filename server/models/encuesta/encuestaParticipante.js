const mongoose = require('mongoose');
let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'encuestaParticipante'
};
let encuestaSchema = new mongoose.Schema({
    idEncuesta: {
        type: mongoose.Types.ObjectId,
        ref: 'encuesta',
        required: [true, 'Favor de ingresar el identificador de la encuesta.']
    },
    idPregunta: {
        type: mongoose.Types.ObjectId,
        ref: 'pregunta',
        required: [true, 'Favor de ingresar el identificador de la pregunta.']
    },
    idRespuesta: {
        type: mongoose.Types.ObjectId,
        ref: 'respuesta',
        required: [true, 'Favor de ingresar el identificador de la respuesta.']
    },
    idParticipante: {
        type: mongoose.Types.ObjectId,
        ref: 'participante',
        required: [true, 'Favor de ingresar el identificador del participante.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

module.exports = mongoose.model('encuestaParticipante', encuestaSchema);