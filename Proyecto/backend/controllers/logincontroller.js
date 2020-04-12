//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

const User = require('../models/User');
const userCtrl = require('./usercontroller');
const loginCtrl = {};

/** 
 * Descripción: Devuelve el usuario que está conectado con la tarjeta.
 * Parámetros de entrada: Nada.
 * Devolución del método: El usuario conectado.
*/
loginCtrl.getUserConnected = async (req, res) => {
    const usr = await User.find({online: true});
    res.json(usr);
};

/** 
 * Descripción: Loguea a un usuario en la interfaz para poder hacer gestiones.
 * Parámetros de entrada: emailOrUsername y password.
 * Devolución del método: Nada.
*/
loginCtrl.login = async (req, res) => {
    const {emailOrUsername, password} = req.body;

    //Si el usuario se identifica por su correo o por su nombre de usuario, hay que identificar para coger el usuario de una manera u otra
    if(emailOrUsername.includes("@")){
        var usr = await userCtrl.getUserByEmail(emailOrUsername);
    }else{
        var usr = await userCtrl.getUserByUsername(emailOrUsername);
    }

    //Si el usuario existe y la contraseña es válida, se refistra el ID en las cookies y queda logueado en la interfaz.
    if(usr == null) {
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/login?msg=noaccount');
    }else{
        if(userCtrl.validatePassword(password, usr.password)){
            res.cookie('user',usr._id.toString(),'max-age=10000');
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND);
        }else{
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/login?msg=wrongpass');
        }
    }
};

/** 
 * Descripción: Loguea a un usuario en la nevera, para poder coger productos y que queden registrados.
 * Parámetros de entrada: username.
 * Devolución del método: Nada.
*/
loginCtrl.loginWithCard = async (req, res) => {

    loginCtrl.disconnecUser({params: {end: 'false'}});

    var usr = await userCtrl.getUserByUsername(req.params.username);
    
    if(usr != null) {
        usr.online = true;
        await usr.save();
    };

    res.end();
};

/** 
 * Descripción: Desloguea a cualquier usuario que estaba logueado usando la nevera.
 * Parámetros de entrada: emailOrUsername y password.
 * Devolución del método: Nada.
*/
loginCtrl.disconnecUser = async (req, res) => {
    const end = req.params.end;

    await User.updateMany({online: true}, {
        online: false
    });

    if(end == 'true'){
        res.end();
    }
};

module.exports = loginCtrl;