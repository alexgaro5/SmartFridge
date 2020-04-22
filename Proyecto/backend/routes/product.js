const { Router } = require('express');
const router = Router();
const productCtrl = require('../controllers/productcontroller')

/** 
 * Descripción: Si llega un get o un post, serán reenviados a los métodos 'getProducts' y 'createProduct' de productcontroller.
*/
router.route('/')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProduct)

/** 
 * Descripción: Si llega un post o un delete, serán reenviados a los métodos 'updateProduct' y 'deleteProduct' de productcontroller.
*/
router.route('/:id')   
    .post(productCtrl.updateProduct)
    .delete(productCtrl.deleteProduct)

/** 
 * Descripción: Si llega un get, será reenviado al método 'getProductByID' de productcontroller.
*/
router.route('/:id&:backend')
    .get(productCtrl.getProductByID)

module.exports = router;