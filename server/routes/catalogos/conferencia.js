const ConferenciaModel = require("../../models/conferencia.model");
const ParticipanteModel = require("../../models/participante.model");
const HelperSearch = require('../../libraries/helperSearch');
const subidorArchivos = require('../../libraries/subirArchivo');
const mongoose = require('mongoose');
// const moment = require('moment');
const moment = require('moment');
require('moment/locale/es-mx');
const ObjectId = require('mongoose').Types.ObjectId;
const express = require("express");
const participanteModel = require("../../models/participante.model");
const { locale } = require("moment");
const app = express();
const totalParticipantes = 70;

app.get('/', async (req, res) => {

    try {

        if (req.query.idConferencia) req.queryMatch._id = req.query.idConferencia;

        if (req.query.termino) req.queryMatch.$or = HelperSearch(['strNombre', 'strDescripcion'], req.query.termino);

        const conferencias = await ConferenciaModel.aggregate([
            {
                $addFields: {
                    dteFechaInicioUnix: { "$toLong": "$dteFechaInicio" }
                }
            },
            {
                $match: {
                    $and: [
                        { dteFechaInicioUnix: { $gte: moment().locale('es-mx').subtract(moment().locale('es-mx').isDST() ? 5 : 6, 'hours').valueOf() } }
                    ]
                }
            },
            { $addFields: { numParticipantes: { $size: "$arrIdParticipante" } } },
            { $addFields: { participantesRestantes: { $subtract: [totalParticipantes, { $size: "$arrIdParticipante" }] } } },

        ]);

        if (conferencias.length <= 0) return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'No se encontraron conferencias para mostrar.',
            cont: {
                count: conferencias.length,
                conferencias
            }
        });
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se han consultado las conferencias exitosamente.',
            cont: {
                count: conferencias.length,
                conferencias
            }
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las conferencias.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.post('/', async (req, res) => {

    try {

        let conferenciaBody = new ConferenciaModel(req.body);

        if (req.files) {
            conferenciaBody.strRutaImagen = await subidorArchivos.subirArchivo(req.files.strRutaImagen, 'imgConferencista', ['image/jpeg', 'image/png', 'image/gif']);
        }

        let conferencia = await conferenciaBody.save();

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se ha registrado la conferencia exitosamente.',
            cont: {
                conferencia
            }
        });

    } catch (err) {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar la conferencia.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });

    }

});

app.patch('/', async (req, res) => {
    try {
        let conferenciaBody = new ConferenciaModel(req.body);
        let participanteBody = new ParticipanteModel(req.body);
        const idConferencia = req.query.idConferencia;
        console.log(idConferencia, participanteBody);
        if (!ObjectId.isValid(idConferencia)) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'No se recibió un identificador válido.',
            cont: {
                idConferencia: ObjectId.isValid(idConferencia),
            }
        });

        const arrIdParticipante = req.body.arrIdParticipante;
        let participante = await ParticipanteModel.findOne({ _id: { $eq: [conferenciaBody.arrIdParticipante] } });

        if (participante == null) {
            return res.status(400).json({
                ok: true,
                resp: 400,
                msg: "El identificador del participante no existe.",
            });
        }

        let idParticipante = [];
        idParticipante = conferenciaBody.arrIdParticipante.map(respuesta => respuesta);

        const encontrado = await ConferenciaModel.aggregate([
            { $match: { _id: ObjectId(idConferencia) } },
            { $match: { arrIdParticipante: { $in: idParticipante } } }
        ]);

        if (encontrado.length >= 1) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `La persona ${participante.strNombre} ${participante.strPrimerApellido}  ya se encuentra registrada en esta conferencia.`,
            cont: {
                participante
            }
        });

        const conferencia = await ConferenciaModel.findByIdAndUpdate(idConferencia, { $addToSet: { arrIdParticipante: arrIdParticipante } }, { new: true });

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: `Se registro asistencia de ${participante.strNombre} ${participante.strPrimerApellido} exitosamente.`,
            cont: {
                conferencia
            }
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: `Error al intentar registrar la asistencia.`,
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.get('/fecha', async (req, res) => {

    try {

        if (req.query.idConferencia) req.queryMatch._id = req.query.idConferencia;

        if (req.query.termino) req.queryMatch.$or = HelperSearch(['strNombre', 'strDescripcion'], req.query.termino);

        const conferencias = await ConferenciaModel.aggregate([
            {
                $addFields: { "creationDate": { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$dteFechaInicio" } } }
            },
            {

                $match: { creationDate: { $gte: moment().format('YYYY-MM-DD HH:mm') } }

            },
            {
                $addFields: { numParticipantes: { $size: "$arrIdParticipante" } }
            },
            { $addFields: { participantesRestantes: { $subtract: [totalParticipantes, { $size: "$arrIdParticipante" }] } } },
            {
                $sort: { dteFechaInicio: 1 }
            }

        ]);
        if (conferencias.length <= 0) return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'No se encontraron conferencias para mostrar.',
            cont: {
                count: conferencias.length,
                conferencias,
                moment: moment().format('YYYY-MM-DD HH:mm'),
                momentLocale: moment().locale()
            }
        });
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se han consultado las conferencias exitosamente.',
            cont: {
                count: conferencias.length,
                conferencias,
                moment: moment().format('YYYY-MM-DD HH:mm'),
                momentLocale: moment().locale()
            }
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las conferencias.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});




module.exports = app;