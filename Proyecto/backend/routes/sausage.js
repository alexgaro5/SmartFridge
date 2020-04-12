const { Router } = require('express');
const router = Router();
const sausageCtrl = require('../controllers/sausagecontroller')

/** 
 * Descripción: Si llega un get, post y delete serán reenviados a los métodos 'getLastSausagesWeight', 'createSausagesWeight' y 'deleteAllRefreshmentsWeight' de sausagecontroller.
*/
router.route('/')
    .get(sausageCtrl.getLastSausagesWeight)
    .post(sausageCtrl.createSausagesWeight)
    .delete(sausageCtrl.deleteAllSausagesWeight)

module.exports = router;