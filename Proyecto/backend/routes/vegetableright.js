const { Router } = require('express');
const router = Router();
const vegetableRightCtrl = require('../controllers/vegetablerightcontroller')

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLastVegetablesWeight', 'createVegetablesWeight' y 'deleteAllVegetablesWeight' de vegetablerightcontroller.
*/
router.route('/')
    .get(vegetableRightCtrl.getLastVegetablesWeight)
    .post(vegetableRightCtrl.createVegetablesWeight)
    .delete(vegetableRightCtrl.deleteAllVegetablesWeight)

module.exports = router;