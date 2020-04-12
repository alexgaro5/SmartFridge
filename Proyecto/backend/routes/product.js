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
 * Descripción: Si llega un get, un post o un delete, serán reenviados a los métodos 'getProductByID', 'updateProduct' y 'deleteProduct' de productcontroller.
*/
router.route('/:id')   
    .get(productCtrl.getProductByID)
    .post(productCtrl.updateProduct)
    .delete(productCtrl.deleteProduct)

module.exports = router;