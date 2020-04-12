//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env'
require('dotenv').config({path: path});

//Variables necesarias
require('./database');
const app = require('./app');

//Aplicamos el puerto que va a utilizar el backend
async function main(){
    await app.listen(process.env.PORT_BACKEND_APP);
}

main();