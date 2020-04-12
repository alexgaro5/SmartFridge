const { Router } = require('express');
const router = Router();
const fruitLeftCtrl = require('../controllers/fruitleftcontroller')

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLastFruitsWeight', 'createFruitsWeight' y 'deleteAllFruitsWeight' de fruitleftcontroller.
*/
router.route('/')
    .get(fruitLeftCtrl.getLastFruitsWeight)
    .post(fruitLeftCtrl.createFruitsWeight)
    .delete(fruitLeftCtrl.deleteAllFruitsWeight)

module.exports = router;