const EnccuestaParticipanteModel = require("../../models/encuesta/encuestaParticipante");
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const express = require("express");
const app = express();


app.post('/', async (req, res) => {
    try {
        let encuestaParticipanteBody = req.body;
        const respuestaOpcional = false;
        const respPcional = false;

        encuestaParticipanteBody.forEach((element, index) => {
            if (index == 3 && element.idRespuesta == '615c741be2f9b53700e48c71') {
                console.log(element, index);
                respuestaOpcional = true;
            }
            if (index > 5) {
                console.log('7 preguntas');
                respPcional = true;
            }
            if (respuestaOpcional && respPcional) {

            }

        });

        // const encuestaRegistrada = await EnccuestaParticipanteModel.insertMany(encuestaParticipanteBody);

        // if (encuestaRegistrada) {
        //     res.status(200).json({
        //         ok: true,
        //         resp: 200,
        //         msg: 'Las respuestas se registrarón exitosamente',
        //         cont: {
        //             encuestaRegistrada
        //         }
        //     })
        // } else {
        //     res.status(400).json({
        //         ok: true,
        //         resp: 200,
        //         msg: 'Error al registrar las respuestas',
        //     })
        // }
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

module.exports = app;