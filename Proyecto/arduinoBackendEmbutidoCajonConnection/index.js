//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 37)) + '.env';
require('dotenv').config({path: path});

//Sirve para hacer peticiones GET, POST, PUT y DELETE al backend.
const axios = require('axios');

//Creamo el objeto server para poder crear una comunicación entre el backend y la placa Arduino.
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

//Abrimos conexión con la Arduino.
server.bind(process.env.PORT_RASPBERRY_SAUSAGE_ARDUINO, process.env.IP_RASPBERRY);

//Si hay algún error en la conexión, nos informará por consola cual es.
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

//Si la conexión se crea con éxito, nos lo notificará por consola.
server.on('listening', () => {
    console.log('connection is opened');
});

//Si llega un paquete de la Arduino...
server.on('message', (str) => {

    //Si nos llega información separamos para ver si es del sensor de nivel o de peso.
    var split = str.toString().split(":");

    //Si es del nivel, puede ser 0 o 1.
    if(split[0] == 'N'){
        //Si es 0, significa que no hay agua, por lo que se va a actualizar el estado y añadir a la lista de la compra.
        if(split[1] == 0){
            console.log("Nivel de agua actualiado a 0.");
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LEVELWATER, {"status": false});
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "levelwater&0&"+ process.env.LEVELWATERNAMESL + "&" + process.env.LEVELWATEREMPTY);
        }else{
        //Si es 1, significa que hay agua, por lo que se va a actualizar el estado y eliminar de la lista de la compra.
            console.log("Nivel de agua actualiado a 1.");
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LEVELWATER, {"status": true});
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "levelwater&0");
        }
    }

    //Si es del peso, vamos a actualizar el estado al peso nuevo.
    if(split[0] == 'P'){
        console.log("Peso del embutido actualizado.");
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SAUSAGE, {"status": split[1]});

        //Si el peso está por debajo de un mínimo, se va a añadir a la lista de la compra, si no es el caso, se va a eliminar de ella.
        if(split[1] < process.env.MIN_SAUSAGE_WEIGHT){
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "sausage&0&"+ process.env.SAUSAGESNAMESL + "&" + process.env.SAUSAGESEMPTY);
        }else{
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "sausage&0");
        }
    }
});