const EnccuestaParticipanteModel = require("../../models/encuesta/encuestaParticipante");
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const express = require("express");
const app = express();


app.post('/', async (req, res) => {
    try {
        let array = [];
        let encuestaParticipanteBody = req.body;
        let preguntaOpcional = false;
        encuestaParticipanteBody.forEach((element, index) => {
            if (element.numeroPregunta == 3 && element.idRespuesta == '615c741be2f9b53700e48c71' && encuestaParticipanteBody.length > 6) {
                preguntaOpcional = true;
            }
        });
        if (preguntaOpcional) {
            encuestaParticipanteBody.forEach((preg) => {
                if (preg.numeroPregunta != 4) {
                    array.push(preg)
                }
            });
        } else {
            encuestaParticipanteBody.forEach((preg) => {

                array.push(preg)

            });
        }
        const encuestaRegistrada = await EnccuestaParticipanteModel.insertMany(array);

        if (encuestaRegistrada) {
            res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Las respuestas se registrarón exitosamente',
                cont: {
                    encuestaRegistrada
                }
            })
        } else {
            res.status(400).json({
                ok: true,
                resp: 200,
                msg: 'Error al registrar las respuestas',
            })
        }
    } catch (err) {
        console.log(err);
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

module.exports = app;