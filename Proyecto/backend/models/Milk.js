const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Milk" en la base de datos de MongoDB.
*/
const milkSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Milk', milkSchema);