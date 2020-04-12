const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "FruitLeft" en la base de datos de MongoDB.
*/
const noteSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('FruitLeft', noteSchema);