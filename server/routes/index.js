/* jshint esversion: 8 */
const express = require('express');
const app = express();

app.use('/imagenes', require('./imagen/imgRequest'));
app.use('/participante', require('./catalogos/participante'))
app.use('/conferencia', require('./catalogos/conferencia'))
app.use('/reporte', require('./catalogos/reporte'))
app.use('/encuesta', require('./catalogos/encuesta'))
module.exports = app;