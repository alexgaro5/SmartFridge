const { Router } = require('express');
const router = Router();
const dietCtrl = require('../controllers/dietcontroller');

/** 
 * Descripción: Si llega un get, serán reenviados al método 'getDietProductByUserAndDay' de dietcontroller.
*/
router.route('/:userId&:day')
    .get(dietCtrl.getDietProductByUserAndDay)

/** 
 * Descripción: Si llega un post, serán reenviados al método 'createDietProduct' de dietcontroller.
*/
router.route('/:userId&:productId')
    .post(dietCtrl.createDietProduct)

/** 
 * Descripción: Si llega un put, serán reenviados al método 'updateDietProduct' de dietcontroller.
*/
router.route('/:productDietId&:end')
    .put(dietCtrl.updateDietProduct)

/** 
 * Descripción: Si llega un delete, serán reenviados al método 'deleteDietProduct' de dietcontroller.
*/  
router.route('/:productDietId')
    .delete(dietCtrl.deleteDietProduct)

module.exports = router;