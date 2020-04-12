const Refreshment = require('../models/Refreshment');
const refreshmentCtrl = {};

/** 
 * Descripción: Devuelve el último cambio registrado desde el sensor de los embutidos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: El último cambio registrado desde el sensor de los embutidos.
*/
refreshmentCtrl.getLastRefreshmentsWeight = async (req, res) => {
    const r = await Refreshment.find().sort({date: 'desc'});
    res.json(r[0]);
}

/** 
 * Descripción: Crea un registro nuevo del sensor de los embutidos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: El usuario conectado.
*/
refreshmentCtrl.createRefreshmentsWeight = async (req, res) => {
    const {status} = req.body;

    const newRefreshment = new Refreshment({
        status: status
    });
    await newRefreshment.save();

    res.end();
}

/** 
 * Descripción: Borra todos los registros almacenados del sensor de los embutidos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: El usuario conectado.
*/
refreshmentCtrl.deleteAllRefreshmentsWeight = async (req, res) => { 
    await Refreshment.deleteMany({});
    res.end();
}

module.exports = refreshmentCtrl;