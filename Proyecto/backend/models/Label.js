const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Label" en la base de datos de MongoDB.
*/
const labelSchema = new Schema({
    idProduct: Number,
    amount: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Label', labelSchema);