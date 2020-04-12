const { Router } = require('express');
const router = Router();
const vegetableLeftCtrl = require('../controllers/vegetableleftcontroller')

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLastVegetablesWeight', 'createVegetablesWeight' y 'deleteAllVegetablesWeight' de vegetableleftcontroller.
*/
router.route('/')
    .get(vegetableLeftCtrl.getLastVegetablesWeight)
    .post(vegetableLeftCtrl.createVegetablesWeight)
    .delete(vegetableLeftCtrl.deleteAllVegetablesWeight)

module.exports = router;