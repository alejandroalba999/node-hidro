const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(fileUpload());

const subirArchivo = async (file, route, exts) => {
    let nameImg = uniqid() + path.extname(file.name);

    if (!exts.includes(file.mimetype)) {
        throw new Error(`Sólo las extensiones (${exts.join(', ')}) son aceptadas`);
    }

    await file.mv(path.resolve(__dirname, `../../uploads/${route}/${nameImg}`)).catch((error) => {
        console.log(error);
        throw new Error('Error al tratar de subir el archivo al servidor', error);
    });

    return nameImg;
};

const borraArchivo = async (nombreImagen, ruta) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${ruta}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        await fs.unlinkSync(pathImg);
    }
};

module.exports = {
    subirArchivo,
    borraArchivo
};