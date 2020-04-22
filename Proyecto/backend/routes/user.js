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
 * Descripción: Si llega un post o delete serán reenviados a los métodos 'updateUser' y 'deleteUser' de usercontroller.
*/
router.route('/:id')
    .post(userCtrl.updateUser)
    .delete(userCtrl.deleteUser)

/** 
 * Descripción: Si llega un get serán reenviados a los métodos 'getUserById' de usercontroller.
*/
router.route('/:id&:backend')
    .get(userCtrl.getUserById)

module.exports = router;