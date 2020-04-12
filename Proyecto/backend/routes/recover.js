const { Router } = require('express');
const router = Router();
const recoverCtrl = require('../controllers/recovercontroller')

/** 
 * Descripción: Si llega un post, serán reenviados al método 'changePassword' de recovercontroller.
*/
router.route('/')
    .post(recoverCtrl.changePassword)

module.exports = router;