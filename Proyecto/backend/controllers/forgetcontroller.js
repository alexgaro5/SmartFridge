//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

//Libreria para enviar correos electrónicos.
const nodemailer = require('nodemailer');

const userCtrl = require('./usercontroller');
const forgetCtrl = {};

/** 
 * Descripción: Método privado para enviar un correo electrónico para recuperar la contraseña de un usuario.
 * Parámetros de entrada: email, token.
 * Devolución del método: Nada.
*/
forgetCtrl.sendEmail = function(req, res){
    const {email, token} = req;

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'smartfridgeual@gmail.com',
            pass: 'Smartfridgeual1'
        }
    });

    var mailOptions = {
        from: 'SmartFridge',
        to: email,
        subject: 'SmartFridge: Recuperar contraseña.',
        html: 
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 700px; height: 300px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h3 style="margin: 0px;">¿Recupera tu contraseña?</h3>
                        <p>Si solicitaste un restablecimiento de contraseña para su cuenta, utiliza el siguiente código de recuperación en la página de restrablecer contraseña. Si no solicitaste esto, ignora este correo electrónico.</p>
                        <h4 style="margin: 0px;">Cógido de recuperación: `+token+`</h4>
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

/** 
 * Descripción: Crea un email para restaurar la contraseña de un usuario. Para ello genera un token y luego tiene que coincidir con el enviado por el correo
 * para que el sistema de permiso para cambiar la contraseña. De esta manera se asegura que la persona cambiando la contraseña es el usuario porque tiene acceso
 * a su correo que es donde se va a enviar copia del token.
 * Parámetros de entrada: emailOrUsername.
 * Devolución del método: Una respuesta con el resultado en forma de enlace.
*/
forgetCtrl.createEmailToRecover  = async (req, res) => {
    const {emailOrUsername} = req.body;

    //Si el usuario se identifica por su correo o por su nombre de usuario, hay que identificar para coger el usuario de una manera u otra
    if(emailOrUsername.includes("@")){
        var usr = await userCtrl.getUserByEmail(emailOrUsername);
    }else{
        var usr = await userCtrl.getUserByUsername(emailOrUsername);
    }

    //Si el usuario no existe, no se hace nada, pero si existe, se genera el token, se guarda en su usuario y se envia un email con el token.
    if(usr == null) {
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/forget?msg=noaccount');
    }else{
        const email = usr.email;
        const token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

        usr.token = token;
        await usr.save();
        forgetCtrl.sendEmail({email, token});

        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/recover?email='+email);
    }
    res.end();
}

module.exports = forgetCtrl;