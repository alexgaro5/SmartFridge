const LevelWater = require('../models/LevelWater');
const levelWaterCtrl = {};

/** 
 * Descripción: Devuelve el último registro del sensor del deposito de agua de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Último registro del deposito de agua.
*/
levelWaterCtrl.getLevelWater = async (req, res) => {
    const lvl = await LevelWater.find().sort({date: 'desc'});;
    res.json(lvl[0]);
}

/** 
 * Descripción: Crea un nuevo registro del sensor del deposito de agua de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
levelWaterCtrl.createLevelWater = async (req, res) => {
    const {status} = req.body;

    const newLevelWater = new LevelWater({
        status: status
    });
    await newLevelWater.save();

    res.end();
}

/** 
 * Descripción: Elimina todos los registros del sensor del deposito de agua de la nevera.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
levelWaterCtrl.deleteAllLevelWater = async (req, res) => { 
    await LevelWater.deleteMany({});
    res.end();
}

module.exports = levelWaterCtrl;