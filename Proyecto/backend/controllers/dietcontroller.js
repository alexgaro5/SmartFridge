//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

//Libreria para enviar correos electrónicos.
const nodemailer = require('nodemailer');

//Importamos los modelos de Diet y User para usarlos después.
const Diet = require('../models/Diet');
const User = require('../models/User');
const dietCtrl = {};

/** 
 * Descripción: Devuelve si hay algun producto en la dieta por su ID interno.
 * Parámetros de entrada: userId y day.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByID = async (req, res) => {
    const d = await Diet.find({_id: req.params.productDietId});
    res.json(d);
}

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario.
 * Parámetros de entrada: userId y day.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByUser = async (req, res) => {
    const d = await Diet.find({userId: req.params.userId});
    res.json(d);
}

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario con la ID del producto que se introduce.
 * Parámetros de entrada: userId y productId.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByUserAndProduct = async (req, res) => {
    const d = await Diet.find({userId: req.params.userId, productId: req.params.productId, day: req.params.day, partOfDay: req.params.partOfDay});
    res.json(d);
}

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario con el nombre que se introduce.
 * Parámetros de entrada: userId y productId.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByUserAndName = async (req, res) => {
    const d = await Diet.find({name: req.params.name, userId: req.params.userId, day: req.params.day, partOfDay: req.params.partOfDay});
    res.json(d);
}

/** 
 * Descripción: Crea una un producto en la dieta de un usuario en concreto.
 * Parámetros de entrada: userId, productId, name, imageUrl, amountPerDay, day y partOfDay.
 * Devolución del método: Nada.
*/
dietCtrl.createDietProduct = async (req, res) => {
    var {userId, productId, amountPerDay, day, partOfDay} = req.body;
    
    //Si el ID del producto es menor de 10 carácteres, significa que es el nombre, por lo que cambiamos el contenido de variable.
    if(productId.length < 10){
        name = productId;
        productId = null;
    }

    //Si el id del producto es nula, el producto viene referenciado por el nombre, si no, tenemos que gaurdar la ID delm producto como tal.
    if(productId != null){
        const pr =  await Diet.find({userId: userId, productId: productId, day: day, partOfDay: partOfDay});

        //Si no hay ningun producto en la dieta del usuario en el dia y parte del dia especificado, se crea, si hay, se avisa.
        if(pr.length == 0){
            const newProduct = new Diet({
                userId: userId,
                productId: productId,
                amountPerDay: amountPerDay,
                remainingAmount: amountPerDay,
                day: day,
                partOfDay: partOfDay
            });
            await newProduct.save();
            
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/diet?msg=success');
        }else{
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/diet?msg=samename');
        }
    }else{
        const pr = await Diet.find({name: name, userId: userId, day: day, partOfDay: partOfDay});

        //Si no hay ningun producto en la dieta del usuario en el dia y parte del dia especificado, se crea, si hay, se avisa.
        if(pr.length == 0){

            switch(name){
                case 'Leche': imageUrl = process.env.MILK_IMG_URL; break;
                case 'Refresco': imageUrl = process.env.REFRESHMENT_IMG_URL; break;
                case 'Huevo': imageUrl = process.env.EGG_IMG_URL; break;
                case 'Fruta': imageUrl = process.env.FRUIT_IMG_URL; break;
                case 'Verdura': imageUrl = process.env.VEGETABLE_IMG_URL; break;
                case 'Embutido': imageUrl = process.env.SAUSAGE_IMG_URL; break;
            }

            const newProduct = new Diet({
                userId: userId,
                name: name,
                imageUrl: imageUrl,
                amountPerDay: amountPerDay,
                remainingAmount: amountPerDay,
                day: day,
                partOfDay: partOfDay
            });
            await newProduct.save();
            
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/diet?msg=success');
        }else{
            res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/diet?msg=samename');
        }
    }
}

/** 
 * Descripción: Actualiza un producto de la dieta de un usuario en concreto.
 * Parámetros de entrada: productDietId, amountPerDay, remainingAmount y partOfDay.
 * Devolución del método: Nada.
*/
dietCtrl.updateDietProduct = async (req, res) => {
    var {amountPerDay, remainingAmount, partOfDay, end} = req.body;

    //Obtenemos el producto der la dieta a actualizar
    var pr = await Diet.find({_id: req.params.productDietId});
    pr = pr[0];

    if(amountPerDay != null){

        if(pr.amountPerDay != amountPerDay){
            pr.amountPerDay = amountPerDay;
            pr.remainingAmount = amountPerDay;
        }else if(pr.remainingAmount != remainingAmount){
            pr.remainingAmount = remainingAmount;
        }
    
        if(partOfDay != null) pr.partOfDay = partOfDay;
    
    }else{
        pr.remainingAmount = remainingAmount;
    }

    await pr.save();
    
    if(end == 'true'){
        res.end()
    }else{
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/editdiet?msg=success&diet=' + req.params.productDietId);
    }
}

/** 
 * Descripción: Elimina un producto de la dieta pasando su ID interna.
 * Parámetros de entrada: productDietId.
 * Devolución del método: Nada.
*/
dietCtrl.deleteDietProduct = async (req, res) => {
    await Diet.findOneAndDelete({_id: req.params.productDietId});
    res.end();
}

/** 
 * Descripción: Elimina los producto de la dieta de un usuario especifico.
 * Parámetros de entrada: userId.
 * Devolución del método:Nada.
*/
dietCtrl.deleteDietProductByUser = async (req, res) => {
    await Diet.deleteMany({userId: req.params.userId});
}

/** 
 * Descripción: Elimina los producto de las dietas con el mismo ID que el producto que se pasa por parámetro.
 * Parámetros de entrada: productId.
 * Devolución del método: Nada.
*/
dietCtrl.deleteDietProductByProduct = async (req, res) => {
    await Diet.deleteMany({productId: req.params.productId});
}

/** 
 * Descripción: Comprueba las cantidades de todos los usuarios y avisa a quien no la consumido los productos especificados. También avisa de los productos que tiene
 * que consumir cada usuario en el dia y momento del dia en el que se haga la llamada a este método.
 * Parámetros de entrada: day, partOfDay.
 * Devolución del método: Nada.
*/
dietCtrl.checkAmount = async (req, res) => {
    const now = new Date();
    const users = await User.find(); 
    
    //Para cada usuario...
    users.map(async user => {

        //Obtenemos el dia y la parte del día actual.
        var day = req.params.day;
        var partOfDay = req.params.partOfDay;

        const email = user.email;
        const productNames = [];

        //Obtenemos los productos de la dieta de un usuario en el día y momento del día actual.
        const products = await Diet.find({userId: user._id, day: day, partOfDay: partOfDay});

        //Si hay algun producto...
        if(products.length != 0){
            //Por cada producto...
            Promise.all(products.map(async product => {

                var name;

                //Obtenemos el nombre del producto y la cantidad de este en la dieta y lo añadimos a un array.
                if(product.productId != null){
                    const {getProductByID} = require('./productcontroller');
                    const product2 = await getProductByID({params: {id: product.productId, backend: 'true'}});
                    name = product2.name;
                }else{
                    name = product.name;
                }
            
                productNames.push(name + " (" + product.amountPerDay + " ud.)");
    
            })).then(() => {

                //Finalmente, enviamos el array junto con el email del usuario y el dia y la parte del día a un método externo para enviar un correo informativo.
                dietCtrl.sendEmailDietProducts({email, productNames, day, partOfDay});
            })
        }

        //Actuializamos el dia y la parte del dia con los que nos pasan por parámetro para comprobar si alguien tiene algun producto sin consumir en su dieta
        //en el dia y parte del  dia especificado.
        if(partOfDay == 0){
            var day2 = (req.params.day - 1).toString();
            var partOfDay2 = "2";
        }else if(partOfDay == 1){
            var day2 = req.params.day.toString();
            var partOfDay2 = "0";
        }else if(partOfDay == 2){
            var day2 = req.params.day.toString();
            var partOfDay2 = "1";
        }

        //Buscamos los productos del usuario en el dia y parte del dia especificado.-
        const products2 = await Diet.find({userId: user._id, day: day2, partOfDay: partOfDay2});
        const productNames2 = [];

        //Si hay algun producto...
        if(products2.length != 0){
            //Por cada producto...
            Promise.all(products2.map(async product => {

                //Si hay productos todavíaa sin consumir...
                if(product.remainingAmount != 0){
        
                    //Se obtiene el nombre del producto y se añade a un array.
                    if(product.productId != null){
                        const {getProductByID} = require('./productcontroller');
                        const product2 = await getProductByID({params: {id: product.productId, backend: 'true'}});
                        name = product2.name;
                    }else{
                        name = product.name;
                    }
                
                    productNames2.push(name);
                }
        
                //Actualizamos la cantiodad de productos a consumir a la cantidad especificada por día.
                product.remainingAmount = product.amountPerDay;
            
                await product.save();   
            })).then(() => {

                //Finalmente, enviamos el array junto con el email del usuario y el dia y la parte del día a un método externo para enviar un correo informativo.
                dietCtrl.sendEmailRemainingAmount({email, productNames2, day2, partOfDay2})
            })
        }
    });
    
    res.end();
}

/** 
 * Descripción: Método privado para enviar un correo electrónico para anunciar de los productos que debe de consumir un usuario en el dia y parte del dia que se especifican.
 * Parámetros de entrada: email, token.
 * Devolución del método: Nada.
*/
dietCtrl.sendEmailDietProducts = function(req, res){
    const {email, productNames} = req;
    var {day, partOfDay} = req;

    switch(day){
        case "0": day = "Domingo"; break;
        case "1": day = "Lunes"; break;
        case "2": day = "Martes"; break;
        case "3": day = "Miércoles"; break;
        case "4": day = "Jueves"; break;
        case "5": day = "Viernes"; break;
        case "6": day = "Sábado"; break;
    }

    switch(partOfDay){
        case "0": partOfDay = "mañana"; break;
        case "1": partOfDay = "tarde"; break;
        case "2": partOfDay = "noche"; break;
    }

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'smartfridgeual@gmail.com',
            pass: 'Smartfridgeual1'
        }
    });

    var mailOptions = {
        from: 'SmartFridge',
        to: email,
        subject: 'SmartFridge: Dieta para el '+day+' por la '+ partOfDay+'.',
        html: 
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 1000px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h1 style="margin: 0px;">Dieta del `+day+` por la `+partOfDay+`</h1>
                        <h4 style="margin-left: 25px; margin-right: 25px; margin-bottom: 25px;">Los productos que debes de consumir son: `+productNames+`.</h2>
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
 * Descripción: Método privado para enviar un correo electrónico para anunciar de que un producto no ha sido consumido.
 * Parámetros de entrada: email, token.
 * Devolución del método: Nada.
*/
dietCtrl.sendEmailRemainingAmount = function(req, res){
    const {email, productNames2} = req;
    var {day2, partOfDay2} = req;

    switch(day2){
        case "0": day2 = "Domingo"; break;
        case "1": day2 = "Lunes"; break;
        case "2": day2 = "Martes"; break;
        case "3": day2 = "Miércoles"; break;
        case "4": day2 = "Jueves"; break;
        case "5": day2 = "Viernes"; break;
        case "6": day2 = "Sábado"; break;
    }

    switch(partOfDay2){
        case "0": partOfDay2 = "mañana"; break;
        case "1": partOfDay2 = "tarde"; break;
        case "2": partOfDay2 = "noche"; break;
    }

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'smartfridgeual@gmail.com',
            pass: 'Smartfridgeual1'
        }
    });

    var mailOptions = {
        from: 'SmartFridge',
        to: email,
        subject: 'SmartFridge: No ha consumido los productos de la dieta.',
        html: 
        `<html>
            <body style="display: flex; align-items: center; background: #E0EAFC; height: 600px;">
                <div style="position: relative; margin: auto; width: 1000px; background-color: white; border-radius: 10px 10px 10px 10px;">
                    <div style="text-align: center; margin: 0px;">
                        <img src="https://i.ibb.co/jGjfZYk/logo.png" alt="logo" height="70" width="70" style="margin-top: 25px;">
                        <h1 style="margin: 0px;">SmartFridge</h1>
                        <h1 style="margin: 0px;">No has seguido la dieta</h1>
                        <h2 style="margin-left: 25px; margin-right: 25px;">No has seguido la dieta programada para el `+day2+` por la `+partOfDay2+`.</h2>
                        <h4 style="margin-left: 25px; margin-right: 25px; margin-bottom: 25px;">Los productos no consumidos son: `+productNames2+`.</h2>
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

module.exports = dietCtrl;