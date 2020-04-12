const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "ShoppingList" en la base de datos de MongoDB.
*/
const shoppingListSchema = new Schema({
    id: String,
    idProduct: String,
    name: String,
    msg: String,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('ShoppingList', shoppingListSchema);