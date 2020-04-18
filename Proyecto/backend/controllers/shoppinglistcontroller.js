//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

//Libreria para enviar correos electrónicos.
var nodemailer = require('nodemailer');

const ShoppingList = require('../models/ShoppingList');
const shoppingListCtrl = {};

/** 
 * Descripción: Método privado para enviar un correo electrónico para avisar de la falta de un producto.
 * Parámetros de entrada: msg.
 * Devolución del método: Nada.
*/
sendEmail = function(req, res){
    const {msg} = req;

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'smartfridgeual@gmail.com',
            pass: 'Smartfridgeual1'
        }
    });

    var mailOptions = {
        from: 'SmartFridge',
        to: process.env.EMAIL_TO_RECEIVE_SHOPPINGLIST,
        subject: 'SmartFridge: Producto agotado.',
        html:
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 1000px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h1 style="margin: 0px;">Producto agotándose</h1>
                        <h2 style="margin-bottom: 25px; color: red;">`+msg+`</h2>
                    </div>
                </div>
            </body>
        </html>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        }
    });
};

/** 
 * Descripción: Devuelte todos los elementos que están en la lista de la compra.
 * Parámetros de entrada: msg.
 * Devolución del método: ShoppingList.
*/
shoppingListCtrl.getShoppingList = async (req, res) => {
    const sl = await ShoppingList.find();
    res.json(sl);
}

/** 
 * Descripción: Crea un nuevo registro en la lista de la compra.
 * Parámetros de entrada: id, idProduct, name, msg, end.
 * Devolución del método: Nada.
*/
shoppingListCtrl.createProductToShoppingList = async (req, res) => {
    const {id, idProduct, name, imageUrl, msg, end} = req.body;
    
    const isAnnunciated = await ShoppingList.find({id: id, idProduct: idProduct});

    //Si no existe este producto en la lista de la compra, se añade.
    if(isAnnunciated.length == 0){
        const newProductToShoppingList = new ShoppingList({
            id: id,
            idProduct: idProduct,
            name: name,
            imageUrl, imageUrl
        });
        await newProductToShoppingList.save();
        sendEmail({msg}); 
    }

    if(end == 'true'){
        res.end();
    }
}

/** 
 * Descripción: Elimina un registro de la lista de compra.
 * Parámetros de entrada: id, idProduct, end.
 * Devolución del método: Nada.
*/
shoppingListCtrl.deleteProductToShoppingList = async (req, res) => {
    const {id, idProduct, end} = req.params;
    if(id != 'product'){
        await ShoppingList.findOneAndDelete({id: id});
    }else{
        await ShoppingList.findOneAndDelete({idProduct: idProduct});
    }

    if(end == 'true'){
        res.end();
    }
}

/** 
 * Descripción: Elimina todos los elementos de la lista de compra.
 * Parámetros de entrada: Nada.
 * Devolución del método: Nada.
*/
shoppingListCtrl.deleteAll = async (req, res) => {
    await ShoppingList.deleteMany({});
    res.end();
}

module.exports = shoppingListCtrl;