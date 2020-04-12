const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Card" en la base de datos de MongoDB.
*/
const cardSchema = new Schema({
    userName: String,
    add: Boolean
});

module.exports = model('Card', cardSchema);