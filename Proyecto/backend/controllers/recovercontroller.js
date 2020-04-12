//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

const userCtrl = require('./usercontroller');
const recoverCtrl = {};


/** 
 * Descripción: Cambia la contraseña de un usuario por petición de recuperar contraseña.
 * Parámetros de entrada: email, password, password2, token.
 * Devolución del método: Nada.
*/
recoverCtrl.changePassword  = async (req, res) => {
    const {email, password, password2, token} = req.body;
    var usr = await userCtrl.getUserByEmail(email);

    //Buscamos el usuario por email. Si existe, validamos el token pasado por parámetro con el almacenado.
    if(usr == null) {
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/login?msg=noaccount');
    }else{
        if(userCtrl.validateToken(token, usr.token)){
            //Si las dos contraseñas son iguales, se guarda la nueva y se resetea el token almacenado.
            if(password === password2){
                usr.password = userCtrl.generateHash(password);
                usr.token = '';
                usr.save();
                res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/recover?msg=success');
            }else{
                res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/recover?msg=wrongpassword&email='+email+'&token='+token);
            }
        }else{
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/login'); 
        }
    }
}

module.exports = recoverCtrl;