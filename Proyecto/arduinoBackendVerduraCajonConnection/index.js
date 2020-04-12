//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 36)) + '.env';
require('dotenv').config({path: path});

//Sirve para hacer peticiones GET, POST, PUT y DELETE al backend.
const axios = require('axios');

//Creamo el objeto server para poder crear una comunicación entre el backend y la placa Arduino.
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

//Abrimos conexión con la Arduino.
server.bind(process.env.PORT_RASPBERRY_FRUIT_ARDUINO, process.env.IP_RASPBERRY);

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

    //Si nos llega información separamos para ver si es del sensor de peso izquierdo o derecho.
    //Sea del izquierdo o del derecho, va a guardar el estado (Peso actual) en el backend y si está por debajo de un mínimo, va a añadir el producto a la lista de compra
    //Si no lo está, lo elimina de la lista de la compra.
    var split = str.toString().split(":");

    if(split[0] == 'PI'){
        console.log("Cajon de verduras izquierdo actualizados.");
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VEGETABLELEFT, {"status": split[1]});
        
        if(split[1] < process.env.MIN_VEGETABLE_WEIGHT){
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "vegetableleft&0&"+ process.env.VEGETABLELEFTNAMESL + "&" + process.env.VEGETABLELEFTEMPTY);
        }else{
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "vegetableleft&0");
        }
    }

    if(split[0] == 'PD'){
        console.log("Cajon de verduras derecho actualizados.");
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VEGETABLERIGHT, {"status": split[1]});
        
        if(split[1] < process.env.MIN_VEGETABLE_WEIGHT){
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "vegetableright&0&"+ process.env.VEGETABLERIGHTNAMESL + "&" + process.env.VEGETABLERIGHTEMPTY);
        }else{
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "vegetableright&0");
        }
    }
});