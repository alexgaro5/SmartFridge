//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

//Libreria para enviar correos electrónicos.
const nodemailer = require('nodemailer');

const Diet = require('../models/Diet');
const dietCtrl = {};

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario en un día en concreto.
 * Parámetros de entrada: userId y day.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByID = async (req, res) => {
    const d = await Diet.find({_id: req.params.productDietId});
    res.json(d);
}

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario en un día en concreto.
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
    
    if(productId.length < 10){
        name = productId;
        productId = null;
    }

    if(productId != null){
        const pr =  await Diet.find({userId: userId, productId: productId, day: day, partOfDay: partOfDay});

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
 * Descripción: Comprueba las cantidades de todos los usuarios y avisa a quien no la consumido los productos especificados.
 * Parámetros de entrada: day, partOfDay.
 * Devolución del método: Nada.
*/
dietCtrl.checkAmount = async (req, res) => {
    var pr = await Diet.find({day: req.params.day, partOfDay: req.params.partOfDay});

    pr.map(async product => {

        if(product.remainingAmount != 0){
            const {getUserById} = require('./usercontroller');
            const user = await getUserById({params: {id: product.userId, backend: 'true'}});
            const email = user.email;

            var name;

            if(product.productId != null){
                const {getProductByID} = require('./productcontroller');
                const product2 = await getProductByID({params: {id: product.productId, backend: 'true'}});
                name = product2.name;
            }else{
                name = product.name;
            }
        
            dietCtrl.sendEmail({email, name})
            
        }

        product.remainingAmount = product.amountPerDay;
    
        await product.save();   

        
    });
    
    res.end();
}

/** 
 * Descripción: Método privado para enviar un correo electrónico para anunciar de que un producto no ha sido consumido.
 * Parámetros de entrada: email, token.
 * Devolución del método: Nada.
*/
dietCtrl.sendEmail = function(req, res){
    const {email, name} = req;

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
                        <h1 style="margin: 0px;">No ha seguido la dieta</h1>
                        <h2 style="margin-left: 25px; margin-right: 25px; margin-bottom: 25px;">El producto '`+name+`' no ha sido consumido en el periodo que estipula la dieta programada para tu usuario.</h2>
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