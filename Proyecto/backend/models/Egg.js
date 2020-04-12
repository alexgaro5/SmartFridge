const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Egg" en la base de datos de MongoDB.
*/
const eggSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Egg', eggSchema);