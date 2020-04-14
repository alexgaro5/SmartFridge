const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Varaible" en la base de datos de MongoDB.
*/
const userSchema = new Schema({
    minProductUnit: Number,
    minEggUnit: Number,
    minRefreshmentUnit: Number,
    minMilkUnit: Number,
    minVegetableWeight: Number,
    minFruitWeight: Number,
    minSausageWeight: Number,
    weightPerMilk: Number,
    weightPerRefreshment: Number,
    weightPerEgg: Number,
});

module.exports = model('Variable', userSchema);