const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Diet" en la base de datos de MongoDB.
*/
const dietSchema = new Schema({
    userId: {type: Schema.ObjectId, ref: model('User')},
    productId: {type: Schema.ObjectId, ref: model('Product')},
    name: String,
    imageUrl: String,
    amountPerDay: Number,
    remainingAmount: Number,
    day: Number,
    partOfDay: Number
});

module.exports = model('Diet', dietSchema);