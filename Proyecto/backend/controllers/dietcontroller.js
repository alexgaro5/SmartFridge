const Diet = require('../models/Diet');
const dietCtrl = {};

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario en un día en concreto.
 * Parámetros de entrada: userId y day.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByUserAndDay = async (req, res) => {
    const d = await Diet.find({userId: req.params.userId, day: req.params.day});
    res.json(d);
}

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario con la ID del producto que se introduce.
 * Parámetros de entrada: userId y productId.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByUserAndProduct = async (req, res) => {
    const d = await Diet.find({userId: req.params.userId, productId: req.params.productId});
    res.json(d);
}

/** 
 * Descripción: Devuelve si hay algun producto en la dieta de un usuario con el nombre que se introduce.
 * Parámetros de entrada: userId y productId.
 * Devolución del método: productos.
*/
dietCtrl.getDietProductByUserAndName = async (req, res) => {
    const d = await Diet.find({name: req.params.name, userId: req.params.userId});
    res.json(d);
}

/** 
 * Descripción: Crea una petición para hacer un cambio en una tarjeta RFID (añadir un usuario a la tarjeta (si add es true) o eliminar el contenido de ella (si add es false)).
 * Parámetros de entrada: userName, add.
 * Devolución del método: Nada.
*/
dietCtrl.setRegisterUserWithCard = async (req, res) => {
    const crd = await Card.find();

    //Si hay alguna petición anterior, se elimina porque solo se quiere mantener una, que es la última registrada.
    if(crd.length != 0){
        await Card.deleteMany({});
    }

    const newCard = new Card({
        userName: req.params.userName,
        add: req.params.add
    });
    await newCard.save();

    res.end();
}

/** 
 * Descripción: Crea una un producto en la dieta de un usuario en concreto.
 * Parámetros de entrada: userId, productId, name, imageUrl, amountPerDay, day y partOfDay.
 * Devolución del método: Nada.
*/
dietCtrl.createDietProduct = async (req, res) => {
    var {userId, productId, name, imageUrl, amountPerDay, day, partOfDay} = req.body;

    if(productId != null){
        const pr =  await dietCtrl.getDietProductByUserAndProduct({params: {userId: userId, productId: productId}});

        if(pr == null){
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
        const pr =  await dietCtrl.getDietProductByUserAndName({params: {userId: userId, name: name}});

        if(pr == null){

            switch(name){
                case 'Leche': imageUrl = process.env.MILK_IMG_URL;
                case 'Refresco': imageUrl = process.env.REFRESHMENT_IMG_URL;
                case 'Huevo': imageUrl = process.env.EGG_IMG_URL;
                case 'Fruta': imageUrl = process.env.FRUIT_IMG_URL;
                case 'Verdura': imageUrl = process.env.VEGETABLE_IMG_URL;
                case 'Embutido': imageUrl = process.env.SAUSAGE_IMG_URL;
            }

            const newProduct = new Diet({
                userId: userId,
                name: name,
                imageUrl: imagenUrl,
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
    var {productDietId, amountPerDay, remainingAmount, partOfDay, end} = req.body;

    const pr = await Diet.find({_id: productDietId});

    if(pr.amountPerDay != amountPerDay){
        pr.amountPerDay = amountPerDay;
        pr.remainingAmount = amountPerDay;
    }

    if(pr.remainingAmount != remainingAmount && remainingAmount >= 0){
        pr.remainingAmount = remainingAmount;
    }

    if(partOfDay != null) pr.partOfDay = partOfDay;

    await pr.save();
    
    if(end == 'true'){
        res.end()
    }else{
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/editdiet?msg=success');
    }
}

/** 
 * Descripción: Elimina un producto de la dieta pasando su ID interna.
 * Parámetros de entrada: productDietId.
 * Devolución del método: Nada.
*/
dietCtrl.deleteDietProduct = async (req, res) => {
    await Diet.findOneAndDelete({_id: req.params.productDietId});
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

    for(var product in pr){
        if(product.remainingAmount != 0){
            const {getUserById} = require('./usercontroller');
            const user = getUserById(product.userId);

            const {getProductByID} = require('./productcontroller');
            const product2 = getProductByID(product.productId);

            const email = user.email;
            const name = product2.name;

            sendEmail({email, name})
        }

        product.remainingAmount = product.amountPerDay;
        await product.save();
    }
}

/** 
 * Descripción: Método privado para enviar un correo electrónico para anunciar de que un producto no ha sido consumido.
 * Parámetros de entrada: email, token.
 * Devolución del método: Nada.
*/
forgetCtrl.sendEmail = function(req, res){
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
                        <h1 style="margin: 0px;">No ha seguido al dieta</h1>
                        <h2 style="margin-left: 25px; margin-right: 25px; margin-bottom: 25px;">El producto `+name+` no ha sido consumido en el periodo que estipula la dieta programada para tu usuario.</h2>
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