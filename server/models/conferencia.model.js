const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'conferencia'
};

let conferenciaSchema = new mongoose.Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre.']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de ingresar la descripción.']
    },
    strNombreConferencista: {
        type: String,
        required: [true, 'Favor de ingresar el nombre del conferencista.']
    },
    strPuesto: {
        type: String,
        required: [true, 'Favor de ingresar el puesto que desempeña.']
    },
    strRutaImagen: {
        type: String,
    },
    dteFechaInicio: {
        type: Date,
        required: [true, 'Es necesario especificar la fecha de inicio de la conferencia.']
    },
    arrIdParticipante: [{
        type: mongoose.Types.ObjectId,
        ref: 'participante'
    }],
    blnActivo: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

module.exports = mongoose.model('conferencia', conferenciaSchema);