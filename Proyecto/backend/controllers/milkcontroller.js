const Milk = require('../models/Milk');
const milkCtrl = {};

/** 
 * Descripción: Devuelve el último registro del sensor de la leche de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Último registro del sensor de la leche de la fruta.
*/
milkCtrl.getMilksWeight = async (req, res) => {
    const m = await Milk.find().sort({date: 'desc'});
    res.json(m[0]);
}

/** 
 * Descripción: Crea un nuevo registro del sensor de la leche de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
milkCtrl.createMilksWeight = async (req, res) => {
    const {status} = req.body;
    
    const newMilk = new Milk({
        status: status
    });

    await newMilk.save();
    res.end();
}

/** 
 * Descripción: Elimina todos los registros del sensor de la leche de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
milkCtrl.deleteAllMilksWeight = async (req, res) => { 
    await Milk.deleteMany({});
    res.end();
}

module.exports = milkCtrl;