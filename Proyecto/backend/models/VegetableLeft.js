const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "VegetableLeft" en la base de datos de MongoDB.
*/
const vegetableSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('VegetableLeft', vegetableSchema);