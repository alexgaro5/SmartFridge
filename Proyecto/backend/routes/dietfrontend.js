const { Router } = require('express');
const router = Router();
const dietCtrl = require('../controllers/dietcontroller');

/** 
 * Descripción: Si llega un get, serán reenviados al método 'getDietProductByUser' de dietcontroller.
*/
router.route('/:userId')
    .get(dietCtrl.getDietProductByUser)

/** 
 * Descripción: Si llega un post, serán reenviados al método 'createDietProduct' de dietcontroller.
*/
router.route('/')
    .post(dietCtrl.createDietProduct)

/** 
 * Descripción: Si llega un delete, serán reenviados al método 'deleteDietProduct' de dietcontroller.
*/  
router.route('/:productDietId')
    .delete(dietCtrl.deleteDietProduct)

module.exports = router;