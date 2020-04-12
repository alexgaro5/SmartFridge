//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 35)) + '.env';
require('dotenv').config({path: path});

//Sirve para hacer peticiones GET, POST, PUT y DELETE al backend.
const axios = require('axios');

//Creamo el objeto server para poder crear una comunicación entre el backend y la placa Arduino.
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

//Abrimos conexión con la Arduino.
server.bind(process.env.PORT_RASPBERRY_DOOR_ARDUINO, process.env.IP_RASPBERRY);

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

    //Si nos llega información separamos para ver si es del sensor de peso uno (huevos), peso dos (refrescos) o peso tres (leche).
    //Sea el peso uno, dos o tres, va a guardar el estado (Peso actual) en el backend y si está por debajo de un mínimo, va a añadir el producto a la lista de compra
    //Si no lo está, lo elimina de la lista de la compra.
    var split = str.toString().split(":");

    if(split[0] == 'P1'){
        console.log("Numero de huevos actualizados.");
        const unit = Math.ceil(split[1] / process.env.WEIGHT_PER_EGG);
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.EGG, {"status": unit});
        
        if(unit < process.env.MIN_EGG_UNIT){
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "egg&0&"+ process.env.EGGSNAMESL + "&" + process.env.EGGSEMPTY);
        }else{
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "egg&0");
        }
    }

    if(split[0] == 'P2'){
        console.log("Numero de refrescos actualizados.");
        const unit = Math.ceil(split[1] / process.env.WEIGHT_PER_REFRESHMENT);
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.REFRESHMENT, {"status": unit});

        if(unit < process.env.MIN_REFRESHMENT_UNIT){
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "refreshment&0&"+ process.env.REFRESHMENTSNAMESL + "&" + process.env.REFRESHMENTSEMPTY);
        }else{
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "refreshment&0");
        }
    }

    if(split[0] == 'P3'){
        console.log("Numero de cartones de leche actualizados.");
        const unit = Math.ceil(split[1] / process.env.WEIGHT_PER_MILK);
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.MILK, {"status": unit});

        if(unit < process.env.MIN_MILK_UNIT){
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "milk&0&"+ process.env.MILKSNAMESL + "&" + process.env.MILKSEMPTY);
        }else{
            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "milk&0");
        }
    }
});