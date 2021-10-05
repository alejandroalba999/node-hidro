const mongoose = require('mongoose');
let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'encuesta'
};
let encuestaSchema = new mongoose.Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre de la encuesta.']
    },
    arrIdPregunta: [{
        type: mongoose.Types.ObjectId,
        ref: 'pregunta'
    }],
    blnActivo: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

module.exports = mongoose.model('encuesta', encuestaSchema);