/* jshint esversion: 8 */
require('./config/config');
require('colors');

const express = require('express');
const opcionesGet = require('./middlewares/opcionesGet');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const moment = require('moment');
// Subir archivos
app.use(fileUpload());
moment.locale('es-mx');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Habilita CORS
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

// Parse application/json
app.use(bodyParser.json());

// Habilitación de carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Rutas
app.use(opcionesGet);
app.use('/api', require('./routes/index'));

// app.use((req, res, next) => {
//     return res.status(200).send({
//         resp: '200',
//         msg: `Bienvenido a la api de Hodrockathon 2021 v1.0`,
//         cont: {}
//     });
// });

// Conexión a la Base de Datos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then((resp) => {
        console.log('[SERVER]'.yellow, `Base de datos ONLINE en: ${process.env.URLDB}`);
    })
    .catch((err) => {
        console.log('[SERVER]'.yellow, `Conexión Fallida: ${err}`);
    });

// Puerto de Escucha
app.listen(process.env.PORT, () => {
    console.log('[SERVER]'.yellow, `Escuchando en puerto: ${process.env.PORT}`);
});

mongoose.connection.on('reconnectFailed', async (err) => {
    try {
        console.log('[SERVER]'.yellow, `No fue posible reconectar la BD.`);
    } catch (e) {
        console.log(err);
    }
});

