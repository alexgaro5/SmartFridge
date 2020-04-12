const { Router } = require('express');
const router = Router();
const activityCtrl = require('../controllers/activitycontroller');

/** 
 * Descripción: Si llega un get o delete con el id del usuario, serán reenviados a los métodos 'getActivity' y 'deleteAllActivity' de activitycontroller.
*/
router.route('/:userId')
    .get(activityCtrl.getActivity)
    .delete(activityCtrl.deleteAllActivity)

/** 
 * Descripción: Si llega un post con el id del usuario y el nombre del producto, serán reenviados al método 'createActivity' de activitycontroller.
*/
router.route('/:userId&:productName')
    .post(activityCtrl.createActivity)

module.exports = router;