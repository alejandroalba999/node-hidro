/* jshint esversion: 8 */

//Importaciones de middlewares

// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de Datos
if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = "mongodb+srv://admin:dAWme7EN95FtSH8z@cluster0-swudu.mongodb.net/HIDRO?retryWrites=true&w=majority";
} else {
    process.env.URLDB = "mongodb+srv://admin:dAWme7EN95FtSH8z@cluster0-swudu.mongodb.net/HIDRO?retryWrites=true&w=majority";
}

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = '3h';

// SEED de Autenticación
process.env.SEED = process.env.SEED || '6~+aA^?r{E,[<aK;;/^-E$&)y9_M';

// Declaración de array de middleweres a usar en las APIS
process.middlewares = [];

// Credenciales del correo electrónico.
process.env.STRCORREO = 'notificaciones.desarrollo@utags.edu.mx';
process.env.STRPASSWORD = `!9,G\\\\qEqU8p==>jE`;

// URL del servidor del FrontEnd
process.env.URL_FRONT = 'https://networking-2021.herokuapp.com/';

