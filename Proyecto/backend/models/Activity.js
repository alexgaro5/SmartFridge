const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Activity" en la base de datos de MongoDB.
*/
const activitySchema = new Schema({
    userId: {type: Schema.ObjectId, ref: model('User')},
    productName: String,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Activity', activitySchema);