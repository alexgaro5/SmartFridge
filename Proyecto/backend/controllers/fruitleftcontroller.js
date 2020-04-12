const FruitLeft = require('../models/FruitLeft');
const fruitLeftCtrl = {};

/** 
 * Descripción: Devuelve el último registro del sensor del cajón izquierdo de la fruta de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Último registro del sensor de del cajón izquierdo de la fruta.
*/
fruitLeftCtrl.getLastFruitsWeight = async (req, res) => {
    const w = await FruitLeft.find().sort({date: 'desc'});
    res.json(w[0]);
}

/** 
 * Descripción: Crea un nuevo registro del sensor del cajón izquierdo de la fruta de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
fruitLeftCtrl.createFruitsWeight = async (req, res) => {
    const {status} = req.body;

    const newFruit = new FruitLeft({
        status: status
    });
    await newFruit.save();

    res.end();
}

/** 
 * Descripción: Elimina todos los registros del sensor del cajón izquierdo de la fruta de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
fruitLeftCtrl.deleteAllFruitsWeight = async (req, res) => { 
    await FruitLeft.deleteMany({});
    res.end();
}

module.exports = fruitLeftCtrl;