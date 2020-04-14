const { Router } = require('express');
const router = Router();
const variableCtrl = require('../controllers/variablecontroller')

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLastVegetablesWeight', 'createVegetablesWeight' y 'deleteAllVegetablesWeight' de vegetableleftcontroller.
*/
router.route('/')
    .get(variableCtrl.getVariable)
    .post(variableCtrl.updateVariable)

module.exports = router;