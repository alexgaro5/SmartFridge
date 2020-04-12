const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Refreshment" en la base de datos de MongoDB.
*/
const refreshmentSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Refreshment', refreshmentSchema);