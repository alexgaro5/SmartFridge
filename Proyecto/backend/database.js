//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env'
require('dotenv').config({path: path});

//Variables necesarias
const mongoose = require('mongoose');
const URI = process.env.URI;

//Creamos la base de datos con las configuraciones necesarias
mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(err => console.log(err));

const connection = mongoose.connection;

connection.once('open', () => console.log(process.env.BD_CONNECTED));