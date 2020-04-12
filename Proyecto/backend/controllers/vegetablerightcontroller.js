const Vegetable = require('../models/VegetableRight');
const vegetableRightCtrl = {};

/** 
 * Descripción: Devuelve el último registro del sensor del cajón derecho de la verdura de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Último registro del sensor de del cajón derecho de la verdura.
*/
vegetableRightCtrl.getLastVegetablesWeight = async (req, res) => {
    const v = await Vegetable.find().sort({date: 'desc'});
    res.json(v[0]);
}

/** 
 * Descripción: Crea un nuevo registro del sensor del cajón derecho de la verdura de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
vegetableRightCtrl.createVegetablesWeight = async (req, res) => {
    const {status} = req.body;

    const newVegetable = new Vegetable({
        status: status
    });
    await newVegetable.save();

    res.end();
}

/** 
 * Descripción: Elimina todos los registros del sensor del cajón derecho de la verdura de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
vegetableRightCtrl.deleteAllVegetablesWeight = async (req, res) => { 
    await Vegetable.deleteMany({});
    res.end();
}

module.exports = vegetableRightCtrl;