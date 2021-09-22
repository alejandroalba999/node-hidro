// Se utiliza la librería Nodemailer que nos permite el envío de correos.
const nodemailer = require('nodemailer');

// Se realiza una class para que sea más genérico y se puedan utilizar en diferentes apis si es que se requiere.
class Mailer {

    constructor() {
        this.transport = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: { user: process.env.STRCORREO, pass: process.env.STRPASSWORD }
        });
        this.mailOptions = {
            from: `"Networking Modelo de Formación Dual" <${process.env.STRCORREO}>`

        };
    }

    sendMail(options) {

        // Opciones que se requieren enviar 
        let mailOptions = {
            ...this.mailOptions,
            ...options
        };

        this.transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }
}

module.exports = new Mailer();