const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "Sausage" en la base de datos de MongoDB.
*/
const sausageSchema = new Schema({
    status: Number,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Sausage', sausageSchema);