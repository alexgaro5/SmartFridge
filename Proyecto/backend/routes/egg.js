const { Router } = require('express');
const router = Router();
const eggCtrl = require('../controllers/eggcontroller');

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLastEggsWeight', 'createEggsWeight' y 'deleteAllEggsWeight' de eggcontroller.
*/
router.route('/')
    .get(eggCtrl.getLastEggsWeight)
    .post(eggCtrl.createEggsWeight)
    .delete(eggCtrl.deleteAllEggsWeight)

module.exports = router;