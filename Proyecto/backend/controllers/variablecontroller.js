const Variable = require('../models/Variable');
const variableCtrl = {};

/** 
 * Descripción: Devuelve el registro de las variables que hay en la base de datos.
 * Parámetros de entrada: Nada.
 * Devolución del método: El contenido de las variables.
*/
variableCtrl.getVariable = async (req, res) => {
    const v = await Variable.find();
    res.json(v[0]);
}

/** 
 * Descripción: Devuelve el registro de las variables que hay en la base de datos.
 * Parámetros de entrada: Nada.
 * Devolución del método: El contenido de las variables.
*/
variableCtrl.getMinProductUnit = async (req, res) => {
    const v = await Variable.find();
    return v[0].minProductUnit;
}

/** 
 * Descripción: Crea un nuevo registro del sensor de la leche de la nevera.
 * Parámetros de entrada: status.
 * Devolución del método: Nada.
*/
variableCtrl.updateVariable = async (req, res) => {
    const {minproduct, minegg, minrefreshment, minmilk, minvegetable, minfruit, minsausage, milkperunit, refreshmentperunit, eggperunit} = req.body;

    var v = await Variable.find();

    if(v.length != 0){
        v[0].minProductUnit = minproduct;
        v[0].minEggUnit = minegg;
        v[0].minRefreshmentUnit = minrefreshment;
        v[0].minMilkUnit = minmilk;
        v[0].minVegetableWeight = minvegetable;
        v[0].minFruitWeight = minfruit;
        v[0].minSausageWeight = minsausage;
        v[0].weightPerMilk = milkperunit;
        v[0].weightPerRefreshment = refreshmentperunit;
        v[0].weightPerEgg = eggperunit;
        await v[0].save();
    }else{
        const newVariable = new Variable({
            minProductUnit: minproduct,
            minEggUnit: minegg,
            minRefreshmentUnit: minrefreshment,
            minMilkUnit: minmilk,
            minVegetableWeight: minvegetable,
            minFruitWeight: minfruit,
            minSausageWeight: minsausage,
            weightPerMilk: milkperunit,
            weightPerRefreshment: refreshmentperunit,
            weightPerEgg: eggperunit
        })
        await newVariable.save();
    }
    
    res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/variable?msg=success');
}

module.exports = variableCtrl;