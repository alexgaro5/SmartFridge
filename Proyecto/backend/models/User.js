const { Schema, model } = require('mongoose');

/** 
 * Descripción: Estrucutra del objeto "User" en la base de datos de MongoDB.
*/
const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    card:{
        type: Boolean,
        delault: false
    },
    online: {
        type: Boolean,
        delault: false
    },
    token: {
        type: String,
        default: ''
    }
});

module.exports = model('User', userSchema);