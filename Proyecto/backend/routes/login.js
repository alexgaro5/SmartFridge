const { Router } = require('express');
const router = Router();
const loginCtrl = require('../controllers/logincontroller')

/** 
 * Descripción: Si llega un get, un post o un delete serán reenviados a los métodos 'getUserConnected', 'login' y 'disconnecUser' de logincontroller.
*/
router.route('/')
    .get(loginCtrl.getUserConnected)
    .post(loginCtrl.login)
    .delete(loginCtrl.disconnecUser)

/** 
 * Descripción: Si llega un post, serán reenviados al método 'loginWithCard' de logincontroller.
*/
router.route('/:username') 
    .post(loginCtrl.loginWithCard)

module.exports = router;