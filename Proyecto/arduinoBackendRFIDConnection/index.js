//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 28)) + '.env';
require('dotenv').config({path: path});

//Libreria para enviar correos electrónicos.
const nodemailer = require('nodemailer');

//Sirve para hacer peticiones GET, POST, PUT y DELETE al backend.
const axios = require('axios');

//Creamo el objeto server y client para poder crear una comunicación entre el backend y la placa Arduino.
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const server = dgram.createSocket('udp4');

//Variables necesarias.
var lastDateConnection, sendemail;

//Abrimos conexión con la Arduino.
server.bind(process.env.PORT_RASPBERRY_RFID_ARDUINO, process.env.IP_RASPBERRY);

//Comprobar cada hora si el controlador tiene comunicación.
setInterval(() => CheckControllerStatus(), 3600000);

//Comprobar cada hora si se ha seguido la dieta.
//setInterval(() => CheckDietStatus(), 3600000);
setInterval(() => CheckDietStatus(), 1000);

var now = new Date();   
var hour = now.getHours();
var flagMorning, flagAfternoon, flagNight;

if(hour >= 8 && hour < 12){
    flagMorning = true;
}else if(hour >= 12 && hour < 20){
    flagAfternoon = true;
}else {
    flagNight = true;
}

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

    //Mostramos el mensaje por consola para obtener mas información.
    str = str.toString();
    console.log(str);

    //Si lo que nos llega es una I es porque la tarjeta está vacía y esta esperando respuesta para ser escrita,
    //por lo que tenemos que preparar un paquete para contestar a la solicitud de "INSERT".
    if(str.includes("I")){

        //Primeramente vamos a comprobar si hay usuarios preparados para añadir a una tarjeta.
        axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.CARD).then(function(card){

            if(card.data.length != 0 && card.data.add){
                var name = "U:" + card.data.userName.toString() + "#";
                name = name.toString();

                //Si la hay, enviamos el nombre del usuario, eliminamos la petición en backend de añadir ese usuario, y acutalizamos el usuario a que tiene una tarjeta asociada.
                client.send(name, process.env.PORT_RASPBERRY_RFID_ARDUINO, process.env.IP_RFID_ARDUINO);
                axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.CARD);
                axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.CARD + card.data.userName.toString() + "&true");
            }else{
                
                //Si no hay usuarios a añadir, vamos a comprobar si hay producto para añadir
                axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LABEL).then(function(label) {
                 
                    if(label.data.length != 0){
        
                        var idLabel = "P:" + label.data[0].idProduct  + "#";
                        var nextAmount = label.data[0].amount - 1;
                    
                        //En caso de haber, le enviamos el ID del producto para que lo escriba en la tarjeta
                        client.send(idLabel, process.env.PORT_RASPBERRY_RFID_ARDUINO, process.env.IP_RFID_ARDUINO);
                        
                        //Si hay más etiquetas con el producto, reducimos la cantidad a -1, si no hay más, eliminamos la etiqueta.
                        if(nextAmount == 0){
                            axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LABEL + label.data[0]._id);
                        }else{
                            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LABEL + label.data[0]._id, {amount: nextAmount, end: "true"});
                        }
        
                    }else{
                        //Si no hay nada para añadir, enviamos una "N" de NOTHING, y mostramos por consola que no hay nada.
                        client.send("N", process.env.PORT_RASPBERRY_RFID_ARDUINO, process.env.IP_RFID_ARDUINO);
                        console.log(process.env.NOT_LABEL_MSG);
                    } 
                });
            }
        })
    }

    //Si no llega no es una I e incluye ";", significa que la tarjeta está escrita y contiene información que tiene que ser
    //ser procesada, por lo que vamos a seguir haciendo otras acciones dependiendo del contenido.
    if(str.includes(";")){

        //Información que nos llega de la última lectura de la tarjeta.
        var splitstr = str.split(";");

        //Accion a realizar, nos va a decir que hacer con la información que contiene la tarjeta.
        const statusRfid = splitstr[0];

        var rfidContentSplit = splitstr[1].trim().split(":");
        //Si lo que nos está llegando es de un usuario (U) o un producto (P).
        const type = rfidContentSplit[0].toString();
        if(rfidContentSplit.length == 2){
            //Si contiene más información el mensaje, como la ID de un producto o el nombre de un usuario.
            var contentRfid = rfidContentSplit[1].toString();
        }

        //Aumentar producto. Estamos metiendo un producto en la nevera, por lo que tenemos que hacer lo siguiente.
        if(statusRfid == 1){
            //Si el producto que se está añadiendo confirmamos que es un producto, tendremos la ID en el contentRfid.
            if(type == 'P'){
                //Buscamos el producto en el backend con el ID contenido en la tarjeta.
                axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.PRODUCT + contentRfid.split("#")[0] + "&false").then(function(product) {
                    //Si el producto existe, anumentamos la cantidad en la nevera a mas 1, si no, mostraremos error por consola.
                    if(product.data != null){
                        axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.PRODUCT + contentRfid, {amount: product.data.amount + 1, end: "true"});
                    }else{
                        console.log(process.env.DOESNT_EXIST_PRODUCT);
                    } 
                });
            }
        }

        //Disminuir producto. Estamos sacando un producto de la nevera, por lo que es parecido al anterior pero diminuyendo la cantidad en menos 1.
        if(statusRfid == 2){
            //Si el producto que se está añadiendo confirmamos que es un producto, tendremos la ID en el contentRfid.
            if(type == 'P'){
                //Buscamos el producto en el backend con el ID contenido en la tarjeta.
                axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.PRODUCT + contentRfid + "&false").then(function(product) {
                    //Si el producto existe, disminuimos la cantidad en la nevera a menos 1, si no, mostraremos error por consola.
                    if(product.data != null){
                        //Si el número de productos es erróneo, se mostrará un error, en caso contrario, disminuimos la cantidad en la nevera a menos 1
                        //Y si hay un usuario logueado usando la nevera, se le asignará este producto a su lista de productos consumidos.
                        if(product.data.amount <= 0){
                            console.log(process.env.ERR_AMOUNT);
                        }else{
                            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.PRODUCT + contentRfid, {amount: product.data.amount - 1, end: "true"});
                            axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN).then(function(user){
                                if(user.data.length != 0){
                                    axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.ACTIVITY + user.data[0]._id, {name: product.data.name, imageUrl: product.data.imageUrl});
                                    
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
                                   
                                    axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET2 + user.data[0]._id + "&" + product.data._id + "&" + day + "&" + hour).then(function(dietproduct){
                                        if(dietproduct.data.length != 0){
                                            axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIETFRONTEND2 + dietproduct.data[0]._id, {remainingAmount: dietproduct.data[0].remainingAmount - 1, end: "true"});
                                        } 
                                    });
                                } 
                            });
                        } 
                    }else{
                        console.log(process.env.DOESNT_EXIST_PRODUCT);
                    } 
                });
            }
        }
        //Usuario. En esta opcion vamos a recibir el username de un usuario.
        if(statusRfid == 3){
            //Comprobamos si tenemos petición de eliminar el contenido del usuario de la tarjeta.
            axios.get("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.CARD).then(function(card){
                //Si tenemos petición, se via un paquete con "S" (Success) para eliminar el contenido.
                //Además, se elimina la petición del backend porque ya ha sido ejecutada, y se actualiza el usuario para mostrar que no tiene ninguna tarjeta asociada.
                if(card.data.length != 0 && !card.data.add){
                    client.send("S", process.env.PORT_RASPBERRY_RFID_ARDUINO, process.env.IP_RFID_ARDUINO);
                    axios.delete("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.CARD);
                    axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.CARD + contentRfid + "&false");
                }else{
                    //Si no tenemos petición, solamente enviamos un "N" (nothing) para que no haga nada con el contenido de la tarjeta, e iniciamos sesión en la nevera
                    //para poder coger productos y que se quede guardado en nuestra lista de productos consumidos.
                    client.send("N", process.env.PORT_RASPBERRY_RFID_ARDUINO, process.env.IP_RFID_ARDUINO);
                    axios.post("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.LOGIN + contentRfid);
                }
            });
        }
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

//Se comprueba el tiempo que ha pasasdo desde la ultima conexión del controlador. Si es mayor a un día, se envía un aviso por correo.
function CheckDietStatus(){
    var now = new Date();     
    var day = now.getDay();
    var hour = now.getHours();
    
    if(hour >= 8 && hour < 12 && flagMorning){
        axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + (day-1) + "&2");
        flagMorning = false;
        flagAfternoon = true;
    }else if(hour >= 12 && hour < 20 && flagAfternoon){
        axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + day + "&0");
        flagAfternoon = false;
        flagNight = true;
    }else if((hour >= 20 || hour < 8) && bflagNight){
        axios.put("http://" + process.env.IP_RASPBERRY + process.env.PORT_BACKEND + process.env.DIET + day + "&1");
        flagNight = false;
        flagMorning = true;
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
        subject: process.env.SUBJECT_RFID_CONTROLLER_EMAIL,
        html:
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 1000px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h2 style="margin-bottom: 25px; color: red;">`+ process.env.MSG_RFID_CONTROLLER_EMAIL +`</h2>
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