const { Router } = require('express');
const router = Router();
const dietCtrl = require('../controllers/dietcontroller');

/** 
 * Descripción: Si llega un get, serán reenviados al método 'getDietProductByUserAndName' de dietcontroller.
*/
router.route('/:userId&:name&:day&:partOfDay')
    .get(dietCtrl.getDietProductByUserAndName)

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