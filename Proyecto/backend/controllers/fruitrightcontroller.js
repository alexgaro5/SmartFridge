const FruitRight = require('../models/FruitRight');
const fruitRightCtrl = {};

/** 
 * Descripción: Devuelve el último registro del sensor del cajón derecho de la fruta de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Último registro del sensor de del cajón derecho de la fruta.
*/
fruitRightCtrl.getLastFruitsWeight = async (req, res) => {
    const w = await FruitRight.find().sort({date: 'desc'});
    res.json(w[0]);
}

/** 
 * Descripción: Crea un nuevo registro del sensor del cajón izquierdo de la fruta de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
fruitRightCtrl.createFruitsWeight = async (req, res) => {
    const {status} = req.body;

    const newFruit = new FruitRight({
        status: status
    })
    await newFruit.save();

    res.end();
}

/** 
 * Descripción: Elimina todos los registros del sensor del cajón derecho de la fruta de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
fruitRightCtrl.deleteAllFruitsWeight = async (req, res) => { 
    await FruitRight.deleteMany({});
    res.end();
}

module.exports = fruitRightCtrl;