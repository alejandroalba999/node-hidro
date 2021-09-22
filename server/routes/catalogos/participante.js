const ParticipanteModel = require("../../models/participante.model");
const HelperSearch = require('../../libraries/helperSearch');
const mailer = require("../../libraries/mails");
const Hogan = require("hogan.js");
const path = require('path');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const express = require("express");
const app = express();

app.get('/', async (req, res) => {

    try {

        if (req.query.idParticipante) req.queryMatch._id = ObjectId(req.query.idParticipante);

        if (req.query.termino) req.queryMatch.$or = HelperSearch(['strNombre', 'strPrimerApellido', 'strSegundoApellido', 'strPuesto', 'strNombreEmpresa', 'strCorreo'], req.query.termino);

        if (req.paginacion.existe) {
            req.paginacion.count = { totalItems: await ParticipanteModel.countDocuments({ ...req.queryMatch }) };
        }

        const participante = await ParticipanteModel.aggregate([{ $match: { ...req.queryMatch } }, { $sort: { created_at: -1 } }, ...req.paginacion.aggregate]);

        if (participante.length <= 0) return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'No se encontraron participantes para mostrar.',
            cont: {
                count: participante.length,
                participante
            }
        });
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se han consultado los participantes exitosamente.',
            cont: {
                count: participante.length,
                participante
            }
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar los participantes.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.post('/', async (req, res) => {

    try {
        let participanteBody = new ParticipanteModel(req.body);

        let encontrado = await ParticipanteModel.findOne({ ...HelperSearch(['strCorreo'], participanteBody.strCorreo, false)[0] });

        if (encontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `El correo ${encontrado.strCorreo} ya se encuentra registrado.`,
            cont: {
                encontrado
            }
        });

        let participante = await participanteBody.save();


        if (participante.arrIdConferencia.length >= 1) {
            const strURL = `${process.env.URL_FRONT}/gafete/${participante._id}`;
            const template = fs.readFileSync(path.resolve(__dirname, `../../assets/templates/verify_account.html`), 'utf-8');
            let compiledTemplate = Hogan.compile(template);
            let mailOptions = {
                to: participante.strCorreo,
                subject: 'Registro de participante.',
                html: compiledTemplate.render({
                    _id: participante._id,
                    strNombre: (participante.strNombre + ' ' + participante.strPrimerApellido + ' ' + (participante.strSegundoApellido ? participante.strSegundoApellido : '')),
                    strURL
                })
            };
            mailer.sendMail(mailOptions);
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Se ha registrado el participante exitosamente.',
            cont: {
                participante
            }
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar el participante.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

module.exports = app;