//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env'
require('dotenv').config({path: path});

//Variables necesarias.
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

//Aplicamos el puerto.
app.set('port', process.env.PORT_BACKEND_APP)

//Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

//Rutas.
app.use(process.env.LEVELWATER, require('./routes/levelwater'))
app.use(process.env.FRUITLEFT, require('./routes/fruitleft'))
app.use(process.env.FRUITRIGHT, require('./routes/fruitright'))
app.use(process.env.VEGETABLELEFT, require('./routes/vegetableleft'))
app.use(process.env.VEGETABLERIGHT, require('./routes/vegetableright'))
app.use(process.env.SAUSAGE, require('./routes/sausage'))
app.use(process.env.REFRESHMENT, require('./routes/refreshment'))
app.use(process.env.MILK, require('./routes/milk'))
app.use(process.env.EGG, require('./routes/egg'))
app.use(process.env.PRODUCT, require('./routes/product'))
app.use(process.env.LABEL, require('./routes/label'))
app.use(process.env.USER, require('./routes/user'))
app.use(process.env.LOGIN, require('./routes/login'))
app.use(process.env.FORGET, require('./routes/forget'))
app.use(process.env.RECOVER, require('./routes/recover'))
app.use(process.env.CARD, require('./routes/card'))
app.use(process.env.SHOPPINGLIST, require('./routes/shoppinglist'))
app.use(process.env.ACTIVITY, require('./routes/activity'))
app.use(process.env.VARIABLE, require('./routes/variable'))

module.exports = app;