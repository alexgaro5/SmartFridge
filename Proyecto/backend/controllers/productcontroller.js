//Variable que guarda el camino donde se encuentra el archivo con las variables globales.
const path = __dirname.substring(0, (process.cwd().length - 7)) + '.env';
require('dotenv').config({path: path});

const Product = require('../models/Product');
const productCtrl = {};

/** 
 * Descripción: Devuelve todos los productos registrados en la base de datos.
 * Parámetros de entrada: Nada.
 * Devolución del método: Todos los registros de productos.
*/
productCtrl.getProducts = async (req, res) => {
    const pr = await Product.find().sort('name');
    res.json(pr);
}

/** 
 * Descripción: Devuelve el producto que coincida con el ID pasado por parámetro.
 * Parámetros de entrada: ID.
 * Devolución del método: Producto con ese ID.
*/
productCtrl.getProductByID = async (req, res) => { 

    if(req.params.id.length == 4){
        var pr = await Product.findOne({id: req.params.id});
    }else{
        var pr = await Product.findOne({_id: req.params.id});
    }
    
    res.json(pr);
}

/** 
 * Descripción: Devuelve el producto que coincida con el nombre pasado por parámetro.
 * Parámetros de entrada: name.
 * Devolución del método: Producto con ese nombre.
*/
productCtrl.getProductByName = async (req, res) => { 
    const pr = await Product.findOne({name: req});
    return pr;
}

/** 
 * Descripción: Crea un producto nuevo.
 * Parámetros de entrada: name.
 * Devolución del método: Nada.
*/
productCtrl.createProduct = async (req, res) => {
    var {name, amount, category, url} = req.body;

    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    if(url == ""){
        url = "https://i.ibb.co/z56MmNq/Logo-UAL-Transparente.png";
    }

    //Buscamos si existe el producto.
    const pr =  await productCtrl.getProductByName(name);

    //Si no existe, se añade.
    if(pr == null){
        const newProduct = new Product({
            id: await productCtrl.getAId(),
            name: name,
            amount: amount,
            category: category,
            imageUrl: url
        });
        await newProduct.save();
        
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/product?msg=success');
        return;
    }
    res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/product?msg=samename');
}

/** 
 * Descripción: Actualiza un producto.
 * Parámetros de entrada: name, amount, end.
 * Devolución del método: Nada.
*/
productCtrl.updateProduct = async (req, res) => { 
    var {name, amount, category, url, end} = req.body;

    if(req.params.id.length == 4){
        var pr = await Product.findOne({id: req.params.id});
    }else{
        var pr = await Product.findOne({_id: req.params.id});
    }
    
    //Si se va a actualizar el nombre, guardamos el anterior, buscamos las etiquetas y la lista de la compra
    //que tienen ese nombre anterior, y las actualizamos con el nombre nuevo. 
    if(name != null){
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        pr.name = name;
    }

    if(url != "" && end == "false"){
        pr.imageUrl = url;
    }

    //Actualizamos el producto.
    pr.amount = amount;
    if(end == "false") pr.category = category;
    await pr.save();

    //Si se ha actualizado la cantidad y esta por debajo del mínimo, se añade a la lista de la compra. Si está por encima, se elimina si existe.
    const {createProductToShoppingList, deleteProductToShoppingList} = require('./shoppinglistcontroller');
    const {getMinProductUnit} = require('./variablecontroller');

    getMinProductUnit().then(function(minamount){
        
        if(amount <= minamount){
            createProductToShoppingList({body: {id: 'product', idProduct: pr.id.toString(), msg: "El producto '"+pr.name+"' se está agotando en el frigorífico.", end: 'false'}});
        }else{
            deleteProductToShoppingList({params: {id: 'product', idProduct: pr.id.toString(), end: 'false'}});
        }
    });

    //Si end = true, se envia un end, si no, se reenvia a una dirección.
    if(end == "true"){
        res.end();
    }else{
        res.redirect('//' + process.env.IP_RASPBERRY + process.env.PORT_FRONTEND + '/editproduct?msg=success&product='+req.params.id);
    }
}

/** 
 * Descripción: Elimina un producto por su ID.
 * Parámetros de entrada: ID.
 * Devolución del método: Nada.
*/
productCtrl.deleteProduct = async (req, res) => {
    const {deleteLabelByIdProduct} = require('./labelcontroller');
    const {deleteProductToShoppingList} = require('./shoppinglistcontroller');

    //Si vamos a eliminar un producto, tenemos que eliminar todas las etiquetas asociadas a ese producto.
    const pr = await Product.findOne({_id: req.params.id});
    deleteLabelByIdProduct(pr.id);
    
    //Si vamos a eliminar un producto, tenemos que eliminar ese producto de la lista de la compra.
    deleteProductToShoppingList({params: {id: 'product', idProduct: req.params.id, end: 'false'}});

    //Eliminamos el producto
    await Product.findOneAndDelete({_id: req.params.id});

    res.end();
}

/** 
 * Descripción: Devuelve una ID válida para asignar a un nuevo producto.
 * Parámetros de entrada: Nada.
 * Devolución del método: ID.
*/
productCtrl.getAId = async (req, res) => { 
    const pr = await Product.find().sort('id');

    for(var i = 1000; i <= 1000+pr.length; i++){
        if(pr[i-1000] == null  || pr[i-1000].id != i){
            return i;
        }
    }

    return '';
}

module.exports = productCtrl;