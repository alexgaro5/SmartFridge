//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 35)) + '.env';
require('dotenv').config({path: path});

//Libreria para enviar correos electrónicos.
const nodemailer = require('nodemailer');

//Sirve para hacer peticiones GET, POST, PUT y DELETE al backend.
const axios = require('axios');

//Creamo el objeto server para poder crear una comunicación entre el backend y la placa Arduino.
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

//Variables necesarias.
var lastDateConnection, sendemail;
var lastEggUnit = 100;
var lastMilkUnit = 100;
var lastRefreshmentUnit = 100;

//Abrimos conexión con la Arduino.
server.bind(process.env.PORT_RASPBERRY_DOOR_ARDUINO, process.env.IP_RASPBERRY);

//Comprobar cada hora si el controlador tiene comunicación.
setInterval(() => CheckControllerStatus(), 3600000);

//Si hay algún error en la conexión, nos informará por consola cual es.
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

//Si la conexión se crea con éxito, nos lo notificará por consola.
server.on('listening', () => {
    console.log('Connection is opened');
});

//Si llega un paquete de la Arduino...
server.on('message', (str) => {

    //Si nos llega un paquete para afirmar que tiene conexión, se actualiza la fecha de la ultima conexión.
    if(str.toString()[0] == 'A'){
        lastDateConnection = new Date();
        sendemail = true;
    }

    //Si nos llega información separamos para ver si es del sensor de peso uno (huevos), peso dos (refrescos) o peso tres (leche).
    //Sea el peso uno, dos o tres, va a guardar el estado (Peso actual) en el backend y si está por debajo de un mínimo, va a añadir el producto a la lista de compra
    //Si no lo está, lo elimina de la lista de la compra.
    var split = str.toString().split(":");

    if(split[0] == 'P1'){
        console.log("Numero de huevos actualizados.");

        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VARIABLE).then(function(result){
        
            const unit = Math.ceil(split[1] / result.data.weightPerEgg);
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.EGG, {"status": unit});
            
            if(lastEggUnit > unit){
                lastEggUnit = unit;
                
                axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN).then(function(user){
                    if(user.data.length != 0){
                        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.ACTIVITY + user.data[0]._id, {name: process.env.EGGSNAMESL, imageUrl: process.env.EGG_IMG_URL});

                        var now = new Date();     
                        var day = now.getDay();
                        var hour = now.getHours();

                        if(hour >= 8 && hour < 12){
                            hour = 0;
                        }else if(hour >= 12 && hour < 20){
                            hour = 1;
                        }else{
                            hour = 2;
                        }

                        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + user.data[0]._id + "&Huevo&" + day + "&" + hour).then(function(dietproduct){
                            if(dietproduct.data.length != 0){
                                axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIETFRONTEND + dietproduct.data[0]._id, {remainingAmount: dietproduct.data[0].remainingAmount - 1, end: "true"});
                            } 
                        });
                    }
                });
            }

            if(unit < result.data.minMilkUnit){
                axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST, {id: "egg", idProduct: "0", name: process.env.EGGSNAMESL, msg: process.env.EGGSEMPTY, imageUrl: process.env.EGG_IMG_URL, end: "true"});
            }else{
                axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "egg&0&true");
            }

        });
    }

    if(split[0] == 'P2'){
        console.log("Numero de refrescos actualizados.");

        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VARIABLE).then(function(result){

            const unit = Math.ceil(split[1] / result.data.weightPerRefreshment);
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.REFRESHMENT, {"status": unit});

            if(lastRefreshmentUnit > unit){
                lastRefreshmentUnit = unit;
                
                axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN).then(function(user){
                    if(user.data.length != 0){
                        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.ACTIVITY + user.data[0]._id, {name: process.env.REFRESHMENTSNAMESL, imageUrl: process.env.REFRESHMENT_IMG_URL});
                    
                        var now = new Date();     
                        var day = now.getDay();
                        var hour = now.getHours();

                        if(hour >= 8 && hour < 12){
                            hour = 0;
                        }else if(hour >= 12 && hour < 20){
                            hour = 1;
                        }else{
                            hour = 2;
                        }

                        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + user.data[0]._id + "&Refresco&" + day + "&" + hour).then(function(dietproduct){
                            if(dietproduct.data.length != 0){
                                axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIETFRONTEND + dietproduct.data[0]._id, {remainingAmount: dietproduct.data[0].remainingAmount - 1, end: "true"});
                            } 
                        });
                    } 
                });
            }

            if(unit < result.data.minRefreshmentUnit){
                axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST, {id: "refreshment", idProduct: "0", name: process.env.REFRESHMENTSNAMESL, msg: process.env.REFRESHMENTSEMPTY, imageUrl: process.env.REFRESHMENT_IMG_URL, end: "true"});
            }else{
                axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "refreshment&0&true");
            }

        });
    }

    if(split[0] == 'P3'){
        console.log("Numero de cartones de leche actualizados.");

        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VARIABLE).then(function(result){

            const unit = Math.ceil(split[1] / result.data.weightPerMilk);
            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.MILK, {"status": unit});

            if(lastMilkUnit > unit){
                lastMilkUnit = unit;
                
                axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN).then(function(user){
                    if(user.data.length != 0){
                        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.ACTIVITY + user.data[0]._id, {name: process.env.MILKSNAMESL, imageUrl: process.env.MILK_IMG_URL});
                    
                        var now = new Date();     
                        var day = now.getDay();
                        var hour = now.getHours();

                        if(hour >= 8 && hour < 12){
                            hour = 0;
                        }else if(hour >= 12 && hour < 20){
                            hour = 1;
                        }else{
                            hour = 2;
                        }

                        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + user.data[0]._id + "&Leche&" + day + "&" + hour).then(function(dietproduct){
                            if(dietproduct.data.length != 0){
                                axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIETFRONTEND + dietproduct.data[0]._id, {remainingAmount: dietproduct.data[0].remainingAmount - 1, end: "true"});
                            } 
                        });
                    } 
                });
            }

            if(unit < result.data.minEggUnit){
                axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST, {id: "milk", idProduct: "0", name: process.env.MILKSNAMESL, msg: process.env.MILKSEMPTY, imageUrl: process.env.MILK_IMG_URL, end: "true"});
            }else{
                axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "milk&0");
            }

        });
    }
});

//Se comprueba el tiempo que ha pasasdo desde la ultima conexión del controlador. Si es mayor a un día, se envía un aviso por correo.
function CheckControllerStatus(){
    const currentDate = new Date();
    
    if(lastDateConnection != null){
        var difference = currentDate.getTime() - lastDateConnection.getTime();
        difference = difference / 3600000;

        if(difference >= 24 && sendemail){
            sendemail = false;
            sendEmail();
        }
    }
}

//Para enviar el correo de aviso.
function sendEmail(req, res){

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'smartfridgeual@gmail.com',
            pass: 'Smartfridgeual1'
        }
    });

    var mailOptions = {
        from: 'SmartFridge',
        to: process.env.EMAIL_TO_RECEIVE_SHOPPINGLIST,
        subject: process.env.SUBJECT_DOOR_CONTROLLER_EMAIL,
        html:
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 1000px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h2 style="margin-bottom: 25px; color: red;">`+ process.env.MSG_DOOR_CONTROLLER_EMAIL +`</h2>
                    </div>
                </div>
            </body>
        </html>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        }
    });
};