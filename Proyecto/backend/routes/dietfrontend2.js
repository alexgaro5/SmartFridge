const { Router } = require('express');
const router = Router();
const dietCtrl = require('../controllers/dietcontroller');

/** 
 * Descripción: Si llega un get, serán reenviados al método 'getDietProductByID' de dietcontroller.
*/
router.route('/:productDietId')
    .get(dietCtrl.getDietProductByID)

/** 
 * Descripción: Si llega un post, serán reenviados al método 'updateDietProduct' de dietcontroller.
*/
router.route('/:productDietId')
    .post(dietCtrl.updateDietProduct)

/** 
 * Descripción: Si llega un delete, serán reenviados al método 'deleteDietProduct' de dietcontroller.
*/  
router.route('/:productDietId')
    .delete(dietCtrl.deleteDietProduct)

module.exports = router;