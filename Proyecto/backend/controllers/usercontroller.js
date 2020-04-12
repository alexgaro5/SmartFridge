//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

//Para encriptar contraseñas.
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/User');
const userCtrl = {};

/** 
 * Descripción: Devuelve todos los usuarios registrados.
 * Parámetros de entrada: Nada.
 * Devolución del método: Todos los usuarios.
*/
userCtrl.getUsers = async (req, res) => {
    const usr = await User.find();
    res.json(usr);
}

/** 
 * Descripción: Devuelve el usuario pedido utilizando su ID para encontrarlo.
 * Parámetros de entrada: ID.
 * Devolución del método: Usuario.
*/
userCtrl.getUserById = async (req, res) => { 
    const usr = await User.findOne({_id: req.params.id});
    res.json(usr);
}

/** 
 * Descripción: Devuelve el usuario pedido utilizando su email para encontrarlo.
 * Parámetros de entrada: email.
 * Devolución del método: Usuario.
*/
userCtrl.getUserByEmail = async (req, res) => { 
    const usr = await User.findOne({email: req});
    return usr;
}

/** 
 * Descripción: Devuelve el usuario pedido utilizando su username para encontrarlo.
 * Parámetros de entrada: username.
 * Devolución del método: Usuario.
*/
userCtrl.getUserByUsername = async (req, res) => { 
    const usr = await User.findOne({username: req});
    return usr;
}

/** 
 * Descripción: Registra un usuario.
 * Parámetros de entrada: email, username, password.
 * Devolución del método: Nada.
*/
userCtrl.createUser = async (req, res) => {
    const {email, username, password} = req.body;

    const usrEmail = await userCtrl.getUserByEmail(email);

    //Comprueba si hay algun usuario con el mismo email, si no es el caso, sigue adelante.

    if(usrEmail != null){
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/user?msg=sameemail');
    }else{

        const usrUsername = await userCtrl.getUserByUsername(username);

        //Comprueba si hay algun usuario con el mismo email, si no es el caso, lo registra.
        if(usrUsername != null){
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/user?msg=sameusername');
        }else{
            const newUser = new User({
                email: email,
                username: username,
                password: userCtrl.generateHash(password),
                online: false,
                card: false
            })
            await newUser.save();

            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/user?msg=success');
        }
    }
}

/** 
 * Descripción: Actualiza el usuario.
 * Parámetros de entrada: id, email, username, password.
 * Devolución del método: Nada.
*/
userCtrl.updateUser = async (req, res) => { 
    const {id, email, username, password} = req.body;

    const usr = await userCtrl.getUserByUsername('admin');

    //Si el user a modificar es 'admin', no se permite.
    if(usr._id != id){

        const usrEmail = await userCtrl.getUserByEmail(email);
        //Si el ID delñ usuario modificando es diferente que el de otro usuario que tiene el mismo email que queremos poner, no podemos asignar ese email porque esta en uso.
        if(usrEmail != null){
            const usrEmailId = usrEmail._id.toString();
            if(usrEmailId != id){
                res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/edituser?msg=sameemail&user='+id);
                return;
            }
        }
        const usrUsername = await userCtrl.getUserByUsername(username);
        //Si el ID delñ usuario modificando es diferente que el de otro usuario que tiene el mismo email que queremos poner, no podemos asignar ese username porque esta en uso.
        if(usrUsername != null){
            const usrUsernameId = usrUsername._id.toString();
            if(usrUsernameId != id){
                res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/edituser?msg=sameusername&user='+id);
                return;
            }
        }
        //Si la contraseña no va en blanco, es que se ha modificado, por lo que la guardamos. En caso contrario, se actualizan los otros parámetros excepto la contraseña.
        if(password != ''){
            await User.findOneAndUpdate({_id: req.params.id}, {
                email: email,
                username: username,
                password: userCtrl.generateHash(password) 
            });
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/edituser?msg=success&user='+id); 
        }else{
            await User.findOneAndUpdate({_id: req.params.id}, {
                email: email,
                username: username
            });
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/edituser?msg=success&user='+id); 
        }
    }
}

/** 
 * Descripción: Elimina un usuario.
 * Parámetros de entrada: id.
 * Devolución del método: Nada.
*/
userCtrl.deleteUser = async (req, res) => { 
    var usr = await userCtrl.getUserByUsername('admin');
    //Si el user a eliminar es 'admin', no se permite.
    if(usr._id != req.params.id){
        //Si vamos a eliminar un usuario, tenemos que eliminar toda su actividad.
        const {deleteAllActivity} = require('./activitycontroller');
        await deleteAllActivity({params: {userId: req.params.id, end: false}});

        await User.findOneAndDelete({_id: req.params.id})
        res.end();
    }
}

/** 
 * Descripción: Administra si un usuario tiene o no tarjeta RFID.
 * Parámetros de entrada: username.
 * Devolución del método: Nada.
*/
userCtrl.adminCard = async (req, res) => { 
    await User.findOneAndUpdate({username: req.params.userName}, {
        online: false,
        card: req.params.add
    });
    res.end();
}

/** 
 * Descripción: Genera un hash para la contraseña.
 * Parámetros de entrada: password.
 * Devolución del método: password encriptada.
*/
userCtrl.generateHash = function (password){
    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(password, salt);
}

/** 
 * Descripción: Devuelve si dos contraseñas son iguales.
 * Parámetros de entrada: password1 y password2.
 * Devolución del método: true o false.
*/
userCtrl.validatePassword = function(password1, password2){
    return bcrypt.compareSync(password1, password2);
}

/** 
 * Descripción: Devuelve si dos tokens son iguales.
 * Parámetros de entrada: token1 y token2.
 * Devolución del método: true o false.
*/
userCtrl.validateToken = function(token1, token2){
    return token1 == token2;
}

module.exports = userCtrl;