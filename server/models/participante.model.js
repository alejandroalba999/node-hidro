const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'participante'
};

let participanteSchema = new mongoose.Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre.']
    },
    strPrimerApellido: {
        type: String,
        required: [true, 'Favor de ingresar el primer apellido.']
    },
    strSegundoApellido: {
        type: String
    },
    strPuesto: {
        type: String,
        required: [true, 'Favor de ingresar el puesto que desempeña.']
    },
    strNombreEmpresa: {
        type: String,
        required: [true, 'Favor de ingresar el nombre de la empresa.']
    },
    nmbTelefono: {
        type: String,
        required: [true, 'Favor de ingresar teléfono']
    },
    strCorreo: {
        type: String,
        required: [true, 'Favor de ingresar el correo electrónico.']
    },
    arrIdConferencia: [{
        type: mongoose.Types.ObjectId,
        ref: 'conferencia'
    }],
    blnActivo: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

module.exports = mongoose.model('participante', participanteSchema);