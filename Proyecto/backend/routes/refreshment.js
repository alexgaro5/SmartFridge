const { Router } = require('express');
const router = Router();
const refreshmentCtrl = require('../controllers/refreshmentcontroller')

/** 
 * Descripción: Si llega un get, post y delete serán reenviados a los métodos 'getRefreshmentsWeight', 'createRefreshmentsWeight' y 'deleteAllRefreshmentsWeight' de refreshmentcontroller.
*/
router.route('/')
    .get(refreshmentCtrl.getLastRefreshmentsWeight)
    .post(refreshmentCtrl.createRefreshmentsWeight)
    .delete(refreshmentCtrl.deleteAllRefreshmentsWeight)

module.exports = router;