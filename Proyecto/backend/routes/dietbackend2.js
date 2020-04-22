const { Router } = require('express');
const router = Router();
const dietCtrl = require('../controllers/dietcontroller');

/** 
 * Descripción: Si llega un get, serán reenviados al método 'getDietProductByUserAndProduct' de dietcontroller.
*/
router.route('/:userId&:productId&:day&:partOfDay')
    .get(dietCtrl.getDietProductByUserAndProduct)

/** 
 * Descripción: Si llega un post, serán reenviados al método 'createDietProduct' de dietcontroller.
*/
router.route('/:userId&:productId')
    .post(dietCtrl.createDietProduct)

/** 
 * Descripción: Si llega un put, serán reenviados al método 'checkAmount' de dietcontroller.
*/
router.route('/:day&:partOfDay')
    .put(dietCtrl.checkAmount)

module.exports = router;