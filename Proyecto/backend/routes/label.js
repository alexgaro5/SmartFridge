const { Router } = require('express');
const router = Router();
const labelCtrl = require('../controllers/labelcontroller')

/** 
 * Descripción: Si llega un get o un post, serán reenviados a los métodos 'getLabels' y 'createLabel' de labelcontroller.
*/
router.route('/')
    .get(labelCtrl.getLabels)
    .post(labelCtrl.createLabel)

/** 
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getLabelByID', 'updateLabel' y 'deleteLabel' de labelcontroller.
*/
router.route('/:id') 
    .get(labelCtrl.getLabelByID)
    .post(labelCtrl.updateLabel)
    .delete(labelCtrl.deleteLabel)

module.exports = router;