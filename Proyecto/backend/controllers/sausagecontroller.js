const Sausage = require('../models/Sausage');
const sausageCtrl = {};

/** 
 * Descripción: Devuelve el último cambio registrado desde el sensor de los refrescos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: El último cambio registrado desde el sensor de los refrescos.
*/
sausageCtrl.getLastSausagesWeight = async (req, res) => {
    const s = await Sausage.find().sort({date: 'desc'});
    res.json(s[0]);
}

/** 
 * Descripción: Crea un registro nuevo del sensor de los refrescos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: El usuario conectado.
*/
sausageCtrl.createSausagesWeight = async (req, res) => {
    const {status} = req.body;

    const newSausage = new Sausage({
        status: status
    });
    await newSausage.save();

    res.end();
}

/** 
 * Descripción: Borra todos los registros almacenados del sensor de los refrescos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: El usuario conectado.
*/
sausageCtrl.deleteAllSausagesWeight = async (req, res) => { 
    await Sausage.deleteMany({});
    res.end();
}

module.exports = sausageCtrl;