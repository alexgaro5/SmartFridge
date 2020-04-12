const { Router } = require('express');
const router = Router();
const forgetCtrl = require('../controllers/forgetcontroller')

/** 
 * Descripción: Si llega un post, serán reenviados al método 'createEmailToRecover' de eggcontroller.
*/
router.route('/')
    .post(forgetCtrl.createEmailToRecover)

module.exports = router;