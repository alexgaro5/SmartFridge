const { Router } = require('express');
const router = Router();
const activityCtrl = require('../controllers/activitycontroller');

/** 
 * Descripción: Si llega un get, un post o delete con el id del usuario, serán reenviados a los métodos 'getActivity', 'createActivity' o 'deleteAllActivity' de activitycontroller.
*/
router.route('/:userId')
    .get(activityCtrl.getActivity)
    .post(activityCtrl.createActivity)

router.route('/:userId&:end')
    .delete(activityCtrl.deleteAllActivity)
    
module.exports = router;