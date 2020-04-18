const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Product" en la base de datos de MongoDB.
*/
const productSchema = new Schema({
    id: Number,
    name: String,
    amount: Number,
    category: String,
    imageUrl: String
});

module.exports = model('Product', productSchema);