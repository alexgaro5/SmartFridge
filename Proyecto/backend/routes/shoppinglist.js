const { Router } = require('express');
const router = Router();
const shoppingListCtrl = require('../controllers/shoppinglistcontroller')

/** 
 * Descripción: Si llega un get y delete serán reenviados a los métodos 'getShoppingList' y 'deleteAll' de shoppinglistcontroller.
*/
router.route('/')
    .get(shoppingListCtrl.getShoppingList)
    .delete(shoppingListCtrl.deleteAll)

/** 
 * Descripción: Si llega un post serán reenviados al método 'createProductToShoppingList' de shoppinglistcontroller.
*/
router.route('/:model&:product&:name&:msg&:end')
    .post(shoppingListCtrl.createProductToShoppingList)

/** 
 * Descripción: Si llega un delete serán reenviados al método 'deleteProductToShoppingList'de shoppinglistcontroller.
*/
router.route('/:model&:product&:end')
    .delete(shoppingListCtrl.deleteProductToShoppingList)

module.exports = router;