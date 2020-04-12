const { Router } = require('express');
const router = Router();
const loginCtrl = require('../controllers/logincontroller')

/** 
 * Descripción: Si llega un get o un post, serán reenviados a los métodos 'getUserConnected' y 'login' de logincontroller.
*/
router.route('/')
    .get(loginCtrl.getUserConnected)
    .post(loginCtrl.login)

/** 
 * Descripción: Si llega un post, serán reenviados al método 'loginWithCard' de logincontroller.
*/
router.route('/:username') 
    .post(loginCtrl.loginWithCard)

/** 
 * Descripción: Si llega un delete, serán reenviados al método 'disconnecUser' de logincontroller.
*/
router.route('/:end') 
    .delete(loginCtrl.disconnecUser)

module.exports = router;