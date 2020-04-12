const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "VegetableRight" en la base de datos de MongoDB.
*/
const vegetableSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('VegetableRight', vegetableSchema);