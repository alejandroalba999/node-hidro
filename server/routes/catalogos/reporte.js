const ConferenciaModel = require("../../models/conferencia.model");
const ParticipanteModel = require("../../models/participante.model");
const EncuestaModel = require("../../models/encuesta/encuestaParticipante");
const express = require("express");
const app = express();
const ObjectId = require('mongoose').Types.ObjectId;
app.get('/', async (req, res) => {

    try {
        const conferencia = await ConferenciaModel.aggregate([
            {
                $project: {
                    _id: 1,
                    strNombre: 1,
                    strNombreConferencista: 1,
                    arrIdParticipante: { $cond: { if: { $isArray: "$arrIdParticipante" }, then: { $size: "$arrIdParticipante" }, else: "NA" } }
                }
            }
        ])
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se han consultado las conferencias exitosamente.',
            cont: {
                conferencia
            }
        })
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las conferencias.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})
app.get('/participantes', async (req, res) => {
    let participantes = [];
    try {
        participantes = await ParticipanteModel.aggregate([{
            $project: {
                strNombre: 1,
                strPrimerApellido: 1,
                strSegundoApellido: 1,
                strNombreEmpresa: 1,
                strPuesto: 1,
                strCorreo: 1
            }
        }]);
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se han consultado las conferencias exitosamente.',
            cont: {
                participantes
            }
        })
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las conferencias.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.get('/conferencias', async (req, res) => {
    const idConferencia = req.query.idConferencia;
    if (idConferencia == undefined) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio el identidicador de la conferencia.',
        })
    }
    try {
        const conferencia = await ConferenciaModel.aggregate([{
            $match: {
                _id: ObjectId(idConferencia)
            }
        }, {
            $project: {
                arrIdParticipante: 1,
                strNombre: 1,
            }
        }, {
            $unwind: "$arrIdParticipante"
        }, {
            $lookup: {
                from: "participante",
                localField: "arrIdParticipante",
                foreignField: "_id",
                as: "persona"
            }
        }, {
            $project: {
                persona: 1
            }
        }]);
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se han consultado las conferencias exitosamente.',
            cont: {
                conferencia
            }
        })
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las conferencias.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.get('/reporteEncuesta', async (req, res) => {

    try {
        const encuesta = await EncuestaModel.aggregate([
            {
                $group:
                {
                    "_id": "$idParticipante", preguntasRealizadas:
                    {
                        $sum: 1
                    }
                }
            },
            {
                $lookup: {
                    from: "participante",
                    localField: "_id",
                    foreignField: "_id",
                    as: "persona"
                }
            }
        ])

        res.status(200).json({
            cont: {
                encuesta
            }
        })
    } catch (error) {
        res.status(400).json({
            cont: {
                err: error
            }
        })
    }

});

module.exports = app;