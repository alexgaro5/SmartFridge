const { Router } = require('express');
const router = Router();
const cardCtrl = require('../controllers/cardcontroller');
const userCtrl = require('../controllers/usercontroller');

/** 
 * Descripción: Si llega un get o delete, serán reenviados a los métodos 'getRegisterUserWithCard' y 'resetRegisterUserWithCard' de cardcontroller.
*/
router.route('/')
    .get(cardCtrl.getRegisterUserWithCard)
    .delete(cardCtrl.resetRegisterUserWithCard)

/** 
 * Descripción: Si llega un post o put con el id del usuario y con la opcion de añadir o eliminar, 
 * serán reenviados a los métodos 'setRegisterUserWithCard' de cardcontroller y 'adminCard' de usercontroller.
*/
router.route('/:userName&:add')
    .post(cardCtrl.setRegisterUserWithCard)
    .put(userCtrl.adminCard)

module.exports = router;