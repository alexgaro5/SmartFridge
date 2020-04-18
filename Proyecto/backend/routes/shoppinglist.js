const { Router } = require('express');
const router = Router();
const shoppingListCtrl = require('../controllers/shoppinglistcontroller')

/** 
 * Descripción: Si llega un get, un post o un delete serán reenviados a los métodos 'getShoppingList', 'createProductToShoppingList' y 'deleteAll' de shoppinglistcontroller.
*/
router.route('/')
    .get(shoppingListCtrl.getShoppingList)
    .post(shoppingListCtrl.createProductToShoppingList)
    .delete(shoppingListCtrl.deleteAll)

/** 
 * Descripción: Si llega un delete serán reenviados al método 'deleteProductToShoppingList'de shoppinglistcontroller.
*/
router.route('/:id&:idProduct&:end')
    .delete(shoppingListCtrl.deleteProductToShoppingList)

module.exports = router;