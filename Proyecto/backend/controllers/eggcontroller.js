const Egg = require('../models/Egg');
const eggCtrl = {};

/** 
 * Descripción: Devuelve el último registro del sensor de los huevos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Último registro del sensor de huevos.
*/
eggCtrl.getLastEggsWeight = async (req, res) => {
    const egg = await Egg.find().sort({date: 'desc'});
    res.json(egg[0]);
}

/** 
 * Descripción: Crea un nuevo registro del sensor de los huevos de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
eggCtrl.createEggsWeight = async (req, res) => {
    const {status} = req.body;

    const newEgg = new Egg({
        status: status
    });
    await newEgg.save();

    res.end();
}

/** 
 * Descripción: Elimina todos los registros del sensor de los huevos de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
eggCtrl.deleteAllEggsWeight = async (req, res) => { 
    await Egg.deleteMany({});
    res.end();
}

module.exports = eggCtrl;