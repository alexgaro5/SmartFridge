const { Router } = require('express');
const router = Router();
const milkCtrl = require('../controllers/milkcontroller')

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getMilksWeight', 'createMilksWeight' y 'deleteAllMilksWeight' de milkcontroller.
*/
router.route('/')
    .get(milkCtrl.getMilksWeight)
    .post(milkCtrl.createMilksWeight)
    .delete(milkCtrl.deleteAllMilksWeight)

module.exports = router;