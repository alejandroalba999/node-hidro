const ConferenciaModel = require("../../models/conferencia.model");
const ParticipanteModel = require("../../models/participante.model");
const EncuestaPersonaModel = require("../../models/encuesta/encuestaParticipante");
const EncuestaModel = require("../../models/encuesta/encuesta.model");

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
        participantes = await ParticipanteModel.aggregate([

            {
                $lookup: {
                    from: "conferencia",
                    let: { arrIdConferencia: "$arrIdConferencia" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$arrIdConferencia"]
                                }
                            }
                        },
                        {
                            $project: {
                                "strNombre": 1,
                                "_id": 0
                            }
                        }
                    ],
                    as: "conferencias"
                }
            },
            {
                $project: {
                    strNombre: 1,
                    strPrimerApellido: 1,
                    strSegundoApellido: 1,
                    strNombreEmpresa: 1,
                    strPuesto: 1,
                    strCorreo: 1,
                    conferencias: 1
                }
            },
        ]);
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
        },
        {
            $unwind: "$arrIdParticipante"
        },
        {
            $lookup: {
                from: "participante",
                let: { arrIdParticipante: "$arrIdParticipante" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$arrIdParticipante"]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "conferencia",
                            let: { arrIdConferencia: "$arrIdConferencia" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$arrIdConferencia"]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        "strNombre": 1,
                                        "_id": 0
                                    }
                                }
                            ],
                            as: "conferencias"
                        }
                    }

                ],
                as: "persona"
            }
            // $lookup: {
            //     from: "participante",
            //     localField: "arrIdParticipante",
            //     foreignField: "_id",
            //     as: "persona"
            // }
        }
            //     , {
            //     $project: {
            //         persona: 1
            //     }
            // }
        ]);
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
        const encuesta = await EncuestaPersonaModel.aggregate([
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
                    let: { idPersona: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$idPersona"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "encuestaParticipante",
                                let: { idPersonaEncuestada: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$idParticipante", "$$idPersonaEncuestada"]
                                            }
                                        }
                                    }, {
                                        $project: {
                                            idPregunta: 1,
                                            idRespuesta: 1
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'pregunta',
                                            let: { idPregunta: "$idPregunta" },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: ["$_id", "$$idPregunta"]
                                                        }
                                                    }
                                                },
                                                {
                                                    $project: {
                                                        "strPregunta": 1,
                                                        "_id": 0
                                                    }
                                                },
                                            ],
                                            as: "pregunta"
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "respuesta",
                                            let: { idRespuesta: "$idRespuesta" },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: ["$_id", "$$idRespuesta"]
                                                        }
                                                    }
                                                },
                                                {
                                                    $project: {
                                                        "strRespuesta": 1,
                                                        "_id": 0
                                                    }
                                                }
                                            ],
                                            as: "respuesta"
                                        }
                                    },
                                    {
                                        $project: {
                                            "pregunta": 1,
                                            "respuesta": 1,
                                            "_id": 0
                                        }
                                    }
                                ],
                                as: "encuesta"
                            }
                        },
                        {
                            $project: {
                                "encuesta": 1,
                                "strCorreo": 1,
                                "strNombre": 1,
                                "strPrimerApellido": 1,
                                "strSegundoApellido": 1,
                                "strPuesto": 1,
                                "_id": 0
                            }
                        }

                    ],
                    as: "persona"
                }
            },
            {
                $project: {
                    "_id": 0
                }
            }
        ])

        res.status(200).json({
            cont: {
                encuesta,
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