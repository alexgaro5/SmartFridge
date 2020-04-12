const Card = require('../models/Card');
const cardCtrl = {};

/** 
 * Descripción: Devuelve si hay alguna petición para hacer algún cambio en alguna tarjeta RFID.
 * Parámetros de entrada: Nada.
 * Devolución del método: Cambios que hacer en una tarjeta.
*/
cardCtrl.getRegisterUserWithCard = async (req, res) => {
    const crd = await Card.find();
    res.json(crd[0]);
}

/** 
 * Descripción: Crea una petición para hacer un cambio en una tarjeta RFID (añadir un usuario a la tarjeta (si add es true) o eliminar el contenido de ella (si add es false)).
 * Parámetros de entrada: userName, add.
 * Devolución del método: Nada.
*/
cardCtrl.setRegisterUserWithCard = async (req, res) => {
    const crd = await Card.find();

    //Si hay alguna petición anterior, se elimina porque solo se quiere mantener una, que es la última registrada.
    if(crd.length != 0){
        await Card.deleteMany({});
    }

    const newCard = new Card({
        userName: req.params.userName,
        add: req.params.add
    });
    await newCard.save();

    res.end();
}

/** 
 * Descripción: Borramos todas las peticiones para modificar tarjetas pendientes en la base de datos.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
cardCtrl.resetRegisterUserWithCard = async (req, res) => {
    await Card.deleteMany({});
    res.end();
}

module.exports = cardCtrl;