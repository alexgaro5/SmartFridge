const Activity = require('../models/Activity');
const activityCtrl = {};

/** 
 * Descripción: Devuelve la actividad que ha tenido un usuario con la nevera (los productos que ha consumido).
 * Parámetros de entrada: userId.
 * Devolución del método: Productos consumidos.
*/
activityCtrl.getActivity = async (req, res) => {
    const act = await Activity.find({userId: req.params.userId}).sort({date: 1});
    res.json(act);
}

/** 
 * Descripción: Crea una actividad nueva en la nevera relacionando el usuario que la ha creado y el producto que ha cogido.
 * Parámetros de entrada: userId, productName.
 * Devolución del método: Nada.
*/
activityCtrl.createActivity = async (req, res) => {
    const userId = req.params.userId;
    const {name, imageUrl} = req.body;
   
    const newActivity = new Activity({
        userId: userId.toString(),
        name: name,
        imageUrl: imageUrl
    });
    await newActivity.save();

    res.end();
}

/** 
 * Descripción: Elimina toda la actividad de un usuario.
 * Parámetros de entrada: userId.
 * Devolución del método: Nada.
*/
activityCtrl.deleteAllActivity = async (req, res) => {

    await Activity.deleteMany({userId: req.params.userId});
    
    if(req.params.end){
        res.end();
    }
}

module.exports = activityCtrl;