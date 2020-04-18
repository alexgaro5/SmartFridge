//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

const Label = require('../models/Label');
const labelCtrl = {};

/** 
 * Descripción: Devuelve las etiquetas registradas.
 * Parámetros de entrada: Nada.
 * Devolución del método: Todas las etiquetas.
*/
labelCtrl.getLabels = async (req, res) => {
    const lb = await Label.find().sort({date: 1});
    res.json(lb);
}

/** 
 * Descripción: Devuelve la etiquetas registrada que tenga el ID introducido.
 * Parámetros de entrada: ID.
 * Devolución del método: Una etiqueta.
*/
labelCtrl.getLabelByID = async (req, res) => { 
    var lb = await Label.findOne({_id: req.params.id});
    res.json(lb);
}

/** 
 * Descripción: Crea una nueva etiqueta.
 * Parámetros de entrada: nameProduct y amount.
 * Devolución del método: Nada.
*/
labelCtrl.createLabel = async (req, res) => {
    const {id, amount} = req.body;

    const lb = await Label.findOne({idProduct: id});

    //Si no hay una etiqueta con este nombre, se crea añadiendo la ID del producto buscándola por el nombre.
    if(lb == null){

        const newLabel = new Label({
            idProduct: id,
            amount: amount
        });
        await newLabel.save();

        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/label?msg=success');
    }else{
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/label?msg=samelabel');
    }
}

/** 
 * Descripción: Actualiza la cantidad de una etiqueta.
 * Parámetros de entrada: amount, end.
 * Devolución del método: Si end = true, nada, si es false, reenvia.
*/
labelCtrl.updateLabel = async (req, res) => { 
    const {amount, end} = req.body;

    await Label.findOneAndUpdate({_id: req.params.id}, {
        amount
    });

    if(end == "true"){
        res.end();
    }else{
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/editlabel?msg=success&label='+req.params.id);
    }
}

/** 
 * Descripción: Elimina la etiqueta que coincida con el ID pasado por parámetro.
 * Parámetros de entrada: ID.
 * Devolución del método: Nada.
*/
labelCtrl.deleteLabel = async (req, res) => { 
    await Label.findOneAndDelete({_id: req.params.id});
    res.end();
}

/** 
 * Descripción: Elimina la etiqueta que coincida con el id del producto pasado por parámetro.
 * Parámetros de entrada: nameProduct.
 * Devolución del método: Nada.
*/
labelCtrl.deleteLabelByIdProduct = async (req, res) => { 
    await Label.findOneAndDelete({idProduct: req}); 
}

module.exports = labelCtrl;