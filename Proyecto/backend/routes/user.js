const { Router } = require('express');
const router = Router();
const userCtrl = require('../controllers/usercontroller')

/** 
 * Descripción: Si llega un get y post serán reenviados a los métodos 'getUsers' y 'createUser' de usercontroller.
*/
router.route('/')
    .get(userCtrl.getUsers)
    .post(userCtrl.createUser)

/** 
 * Descripción: Si llega un get, post y delete serán reenviados a los métodos 'getUserById' y 'deleteUser' de usercontroller.
*/
router.route('/:id')
    .get(userCtrl.getUserById)
    .post(userCtrl.updateUser)
    .delete(userCtrl.deleteUser)

module.exports = router;