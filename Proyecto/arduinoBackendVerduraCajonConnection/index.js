//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 36)) + '.env';
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
var lastVegetableLeftWeight = 100.0;
var lastVegetableRighttWeight = 100.0;

//Abrimos conexión con la Arduino.
server.bind(process.env.PORT_RASPBERRY_VEGETABLE_ARDUINO, process.env.IP_RASPBERRY);

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

    //Si nos llega información separamos para ver si es del sensor de peso izquierdo o derecho.
    //Sea del izquierdo o del derecho, va a guardar el estado (Peso actual) en el backend y si está por debajo de un mínimo, va a añadir el producto a la lista de compra
    //Si no lo está, lo elimina de la lista de la compra.
    var split = str.toString().split(":");

    if(split[0] == 'PI'){
        console.log("Cajon de verduras izquierdo actualizados.");
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VEGETABLELEFT, {"status": split[1]});
        
        if((lastVegetableLeftWeight - 0.30) >= split[1]){
            lastVegetableLeftWeight = split[1];
            
            //Si hay algun usuario coenctado, se va a guardar en su actividad el producto consumido, y si está en la dieta de ese día, se va a aplicar como consumido.
            axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN).then(function(user){
                if(user.data.length != 0){
                    axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.ACTIVITY + user.data[0]._id, {name: process.env.VEGETABLELEFTNAMESL, imageUrl: process.env.VEGETABLE_IMG_URL});
                
                    var now = new Date();     
                    var day = now.getDay();
                    var hour = now.getHours();

                    if(hour >= 8 && hour < 12) hour = 0;
                    else if(hour >= 12 && hour < 20) hour = 1; 
                    else hour = 2;

                    axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + user.data[0]._id + "&Verdura&" + day + "&" + hour).then(function(dietproduct){
                        if(dietproduct.data.length != 0){
                            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIETFRONTEND2 + dietproduct.data[0]._id, {remainingAmount: dietproduct.data[0].remainingAmount - 1, end: "true"});
                        } 
                    });
                } 
            });
        }

        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VARIABLE).then(function(result){
            if(split[1] < result.data.minVegetableWeight/1000){
                axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST, {id: "vegetableleft", idProduct: "0", name: process.env.VEGETABLELEFTNAMESL, msg: process.env.VEGETABLELEFTEMPTY, imageUrl: process.env.VEGETABLE_IMG_URL, end: "true"});
            }else{
                axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "vegetableleft&0&true");
            }
        });
    }

    if(split[0] == 'PD'){
        console.log("Cajon de verduras derecho actualizados.");
        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VEGETABLERIGHT, {"status": split[1]});
        
        if((lastVegetableRighttWeight - 0.30) >= split[1]){
            lastVegetableRighttWeight = split[1];
            
            //Si hay algun usuario coenctado, se va a guardar en su actividad el producto consumido, y si está en la dieta de ese día, se va a aplicar como consumido.
            axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN).then(function(user){
                if(user.data.length != 0){
                    axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.ACTIVITY + user.data[0]._id, {name: process.env.VEGETABLERIGHTNAMESL, imageUrl: process.env.VEGETABLE_IMG_URL});
                    
                    var now = new Date();     
                    var day = now.getDay();
                    var hour = now.getHours();

                    if(hour >= 8 && hour < 12) hour = 0;
                    else if(hour >= 12 && hour < 20) hour = 1; 
                    else hour = 2;

                    axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + user.data[0]._id + "&Verdura&" + day + "&" + hour).then(function(dietproduct){
                        if(dietproduct.data.length != 0){
                            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIETFRONTEND2 + dietproduct.data[0]._id, {remainingAmount: dietproduct.data[0].remainingAmount - 1, end: "true"});
                        } 
                    });
                } 
            });
        }

        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.VARIABLE).then(function(result){
            
            if(split[1] < result.data.minVegetableWeight/1000){
                axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST, {id: "vegetableright", idProduct: "0", name: process.env.VEGETABLERIGHTNAMESL, msg: process.env.VEGETABLERIGHTEMPTY, imageUrl: process.env.VEGETABLE_IMG_URL, end: "true"});
            }else{
                axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.SHOPPINGLIST + "vegetableright&0&true");
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
        subject: process.env.SUBJECT_VEGETABLE_CONTROLLER_EMAIL,
        html:
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 1000px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h2 style="margin-bottom: 25px; color: red;">`+ process.env.MSG_VEGETABLE_CONTROLLER_EMAIL +`</h2>
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