const { Router } = require('express');
const router = Router();
const fruitRightCtrl = require('../controllers/fruitrightcontroller')

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLastFruitsWeight', 'createFruitsWeight' y 'deleteAllFruitsWeight' de fruitrightcontroller.
*/
router.route('/')
    .get(fruitRightCtrl.getLastFruitsWeight)
    .post(fruitRightCtrl.createFruitsWeight)
    .delete(fruitRightCtrl.deleteAllFruitsWeight)

module.exports = router;