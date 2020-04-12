const { Router } = require('express');
const router = Router();
const levelWaterCtrl = require('../controllers/levelwatercontroller');

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLevelWater', 'createLevelWater' y 'deleteAllLevelWater' de levelwatercontroller.
*/
router.route('/')
    .get(levelWaterCtrl.getLevelWater)
    .post(levelWaterCtrl.createLevelWater)
    .delete(levelWaterCtrl.deleteAllLevelWater)

module.exports = router;