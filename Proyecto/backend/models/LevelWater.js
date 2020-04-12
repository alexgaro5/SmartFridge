const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "LevelWater" en la base de datos de MongoDB.
*/
const levelWaterSchema = new Schema({
    status: Boolean,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('LevelWater', levelWaterSchema);