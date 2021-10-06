const EncuestaModel = require("../../models/encuesta/encuesta.model");
const PreguntaModel = require("../../models/encuesta/pregunta.model");
const RespuestaModel = require("../../models/encuesta/respuesta.model");
const ParticipanteModel = require("../../models/participante.model");
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const express = require("express");
const app = express();

app.post('/obtenerEncuestas', async (req, res) => {

    try {
        const correo = req.body.strCorreo;
        const correoEncontrado = await ParticipanteModel.findOne({ strCorreo: correo });
        if (!correoEncontrado) {
            res.status(400).json({
                ok: true,
                resp: 400,
                msg: 'El correo no se encuentra registrado.',
                cont: {
                    correo
                }
            })
        } else {
            const encuestas = await EncuestaModel.aggregate([
                {
                    $lookup: {
                        from: "pregunta",
                        let: { arrIdPregunta: "$arrIdPregunta" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ["$_id", "$$arrIdPregunta"]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: "respuesta",
                                    let: { arrIdRespuesta: "$arrIdRespuesta" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $in: ["$_id", "$$arrIdRespuesta"]
                                                }
                                            }
                                        }
                                    ],
                                    as: "arrIdRespuesta"
                                }
                            }],
                        as: "preguntaEncuesta"
                    }
                },
                {
                    $project: {
                        strNombre: 1,
                        preguntaEncuesta: 1,
                    }
                },
            ]);

            if (encuestas) {
                res.status(200).json({
                    ok: true,
                    resp: 400,
                    msg: 'Encuesta obtenida exitosamente',
                    cont: {
                        encuestas,
                        idParticipante: correoEncontrado._id
                    }
                })
            }

        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar la encuesta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

app.post('/', async (req, res) => {
    try {
        let encuestaBody = new EncuestaModel(req.body);

        let encuestaEncontrada = await EncuestaModel.findOne({ strNombre: encuestaBody.strNombre });
        if (encuestaEncontrada) {
            res.status(400).json({
                ok: true,
                resp: 400,
                msg: 'La encuesta ya se encuetra registrada.',
                cont: {
                    encuestaEncontrada
                }
            })
        } else {
            let encuesta = await encuestaBody.save();
            if (encuesta) {
                res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Se ha registrado la encuesta exitosamente.',
                    cont: {
                        encuesta
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar la encuesta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});
app.post('/pregunta', async (req, res) => {
    try {
        let preguntaBody = new PreguntaModel(req.body);

        let preguntaEncontrada = await PreguntaModel.findOne({ strPregunta: preguntaBody.strPregunta });
        if (preguntaEncontrada) {
            res.status(400).json({
                ok: true,
                resp: 400,
                msg: 'La pregunta ya se encuetra registrada.',
                cont: {
                    preguntaEncontrada
                }
            })
        } else {
            let pregunta = await preguntaBody.save();
            if (pregunta) {
                res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Se ha registrado la pregunta exitosamente.',
                    cont: {
                        pregunta
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar la pregunta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});
app.post('/respuesta', async (req, res) => {
    try {
        let respuestaBody = new RespuestaModel(req.body);

        let respuestaEncontrada = await RespuestaModel.findOne({ strRespuesta: respuestaBody.strRespuesta });
        if (respuestaEncontrada) {
            res.status(400).json({
                ok: true,
                resp: 400,
                msg: 'La respuesta ya se encuetra registrada.',
                cont: {
                    respuestaEncontrada
                }
            })
        } else {
            let respuesta = await respuestaBody.save();
            if (respuesta) {
                res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Se ha registrado la respuesta exitosamente.',
                    cont: {
                        respuesta
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar la respuesta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;