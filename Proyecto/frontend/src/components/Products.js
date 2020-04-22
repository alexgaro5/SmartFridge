//Importamos react, axios, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import axios from 'axios'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de productos
export default class Products extends Component {

    //Vamos a tener variables(cat1, cat2...) para guardar los diferentes productos que puede haber dentro de la nevera y luego mostrarlos
    //Ademas, tenemos la variable message por si hay que mostrar alguno y vars para obtener las varaibles de la dirección web
    state = {
        cat1: [],
        cat2: [],
        cat3: [],
        cat4: [],
        cat5: [],
        cat6: [],
        cat7: [],
        sausage: [],
        levelwater: [],
        egg: [],
        refreshment: [],
        milk: [],
        vegetableleft: [],
        vegetableright: [],
        fruitleft: [],
        fruitright: []
    }

    message = '';
    vars = getUrlVariables();

    //Metodo que envia la petición para obtener los productos de la nevera.
    getProducts = async () => {

        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT);

        res.data.map((product) => {
            switch(product.category){
                case "Leche y derivados":
                    if(this.state.cat1.filter(pr => pr.name === product.name).length === 0) this.setState({cat1: this.state.cat1.concat(product)});
                    break;
                case "Carnes, pescados y huevos":
                    if(this.state.cat2.filter(pr => pr.name === product.name).length === 0) this.setState({cat2: this.state.cat2.concat(product)});
                    break;
                case "Patatas, legumbres, frutos secos":
                    if(this.state.cat3.filter(pr => pr.name === product.name).length === 0) this.setState({cat3: this.state.cat3.concat(product)});
                    break;
                case "Verduras y Hortalizas":
                    if(this.state.cat4.filter(pr => pr.name === product.name).length === 0) this.setState({cat4: this.state.cat4.concat(product)});
                    break;
                case "Frutas":
                    if(this.state.cat5.filter(pr => pr.name === product.name).length === 0) this.setState({cat5: this.state.cat5.concat(product)});
                    break;
                case "Cereales y derivados, azúcar y dulces":
                    if(this.state.cat6.filter(pr => pr.name === product.name).length === 0) this.setState({cat6: this.state.cat6.concat(product)});
                    break;
                case "Grasas, aceite y mantequilla": 
                    if(this.state.cat7.filter(pr => pr.name === product.name).length === 0) this.setState({cat7: this.state.cat7.concat(product)});
                    break;
                default:
                    break;
            }
            return "";
        })
    }

    //Metodo que envia la petición para obtener los productos del cajon de las verduras izquierdo de la nevera.
    getVegetableLeft = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_VEGETABLESLEFT);
        this.setState({vegetableleft: res.data});
    }

    //Metodo que envia la petición para obtener los productos del cajon de las verduras derecho de la nevera.
    getVegetableRight = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_FRUITRIGHT);
        this.setState({fruitright: res.data});
    }

    //Metodo que envia la petición para obtener los productos del cajon de las fruta izquierdo de la nevera.
    getFruitLeft = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_FRUITLEFT);
        this.setState({fruitleft: res.data});
    }

    //Metodo que envia la petición para obtener los productos del cajon de las fruta derecho de la nevera.
    getFruitRight = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_VEGETABLESRIGHT);
        this.setState({vegetableright: res.data});
    }

    //Metodo que envia la petición para obtener el numero de huevos que hay en la nevera.
    getEgg = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_EGGS);
        this.setState({egg: res.data});
    }

    //Metodo que envia la petición para obtener el numero de refrescos que hay en la nevera.
    getRefreshment = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_REFRESHMENTS);
        this.setState({refreshment: res.data});
    }

    //Metodo que envia la petición para obtener el numero de brick de leche que hay en la nevera.
    getMilk = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_MILK);
        this.setState({milk: res.data});
    }

    //Metodo que envia la petición para obtener el peso de embutido que hay en la nevera.
    getSausage = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_SAUSAGES);
        this.setState({sausage: res.data});
    }

    //Metodo que envia la petición para obtener el nivel de agua del deposito que hay en la nevera.
    getLevelWater = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LEVELWATER);
        this.setState({levelwater: res.data});
    }

    //Reenvia a la pagina de edición del producto.
    editProduct = async (id) => {
        window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND + process.env.REACT_APP_EDITPRODUCT + id;
    }

    //Elimina el producto pasado por parámetro
    deleteProduct = async (id, name) => {
        if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_PRODUCT + "'" + name + "'? " + process.env.REACT_APP_CONFIRM_DELETE_PRODUCT_REMEMBER)) {
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + id);
            this.setState({cat1: []});
            this.setState({cat2: []});
            this.setState({cat3: []});
            this.setState({cat4: []});
            this.setState({cat5: []});
            this.setState({cat6: []});
            this.setState({cat7: []});
            this.getProducts();
        }
    }

    //Cuando el componente esté montado, se llamará al los metodos anteriores para obtener los datos de los productos y mostrarlos
    //Ademas, se va a estar actualizando los datos a mostrar cada segundo.
    async componentDidMount(){
        this.getProducts();
        this.getSausage();
        this.getLevelWater();
        this.getEgg();
        this.getRefreshment();
        this.getMilk();
        this.getVegetableLeft();
        this.getVegetableRight();
        this.getFruitLeft()
        this.getFruitRight()
        setInterval(() => this.getProducts(), 1000);
        setInterval(() => this.getSausage(), 1000);
        setInterval(() => this.getLevelWater(), 1000);
        setInterval(() => this.getEgg(), 1000);
        setInterval(() => this.getRefreshment(), 1000);
        setInterval(() => this.getMilk(), 1000);
        setInterval(() => this.getVegetableLeft(), 1000);
        setInterval(() => this.getVegetableRight(), 1000);
        setInterval(() => this.getFruitLeft(), 1000);
        setInterval(() => this.getFruitRight(), 1000);
    }

    //Es un método que sirve para cambiar el valor del input de la variable con ayuda de botones.
    modifyAmount(delta) {
        const valor = parseInt(document.form.amount.value);
        delta = parseInt(delta);

        if(valor !== 0 || delta !== -1){
            document.form.amount.value = parseInt(valor)+parseInt(delta);
        }
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
        if(this.vars['msg'] === 'samename') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_SAME_PRODUCT}</div>;
            if(this.vars['msg'] === 'existslabel') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_ERR_DELETE_PRODUCT}</div>;
            if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_PRODUCT_ADDED}</div>;
            return this.message;
        }
        return null;
    }

    render() {
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return (
                <div id="accordion">
                    <div className="row">
                        <div className="col-md-12">

                            { this.Anuncio() }

                            <div className="card">
                                <button className="btn" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <h4 id="headingOne" className="mb-0">
                                        <span className="fas fa-plus-square"></span> Añadir nuevo producto
                                    </h4>
                                    <span className="fas fa-chevron-circle-down"></span>
                                </button>

                                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                    
                                    <div className="card-body">

                                        <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT} method="post" name="form">
                                            <div className="form-group">
                                                <label htmlFor="name">Nombre del producto:</label>
                                                <input type="text" name="name" className="form-control" required/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Cantidad:</label>
                                                <input type="number" name="amount" defaultValue='0' min='0' max='100' className="form-control" required/>
                                                <div className="text-center">
                                                    <input style={{marginTop: 10, marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-1)}></input> 
                                                    <input style={{marginTop: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+1)}></input>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="category">Categoría:</label>
                                                <select id="category" name="category" className="form-control" required>
                                                    <option value="Leche y derivados">Leche y derivados</option>
                                                    <option value="Carnes, pescados y huevos">Carnes, pescados y huevos</option>
                                                    <option value="Patatas, legumbres, frutos secos">Patatas, legumbres, frutos secos</option>
                                                    <option value="Cereales y derivados, azúcar y dulces">Cereales y derivados, azúcar y dulces</option>
                                                    <option value="Grasas, aceite y mantequilla">Grasas, aceite y mantequilla</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="url">URL de la imagen:</label>
                                                <input type="url" name="url" className="form-control"/>
                                            </div>
                                            <div className='text-center'>
                                                <input type="submit" value="Añadir" className="btn btn-primary btn-lg" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div style={{marginTop: 15}} className="card">
                                <div className="card-body">
                                    <h2>Productos</h2>
                                    <h3>Agua</h3>
                                    <br/>
                                    <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                        <ul className="nopointul text-center">
                                            <li><img src={process.env.REACT_APP_IMAGES + "water.png"} alt={"agua.png"} height="100px" className="maxwidth"></img></li>
                                            <li><strong>Depósito de agua</strong></li>
                                            <li>Estado: {this.state.levelwater.status ? "Lleno" : "Vacío"}</li>
                                        </ul>
                                    </div>
                                    <br/>
                                    <h3>Leche y derivados</h3>
                                    <br/>
                                    <div className="row">
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block bootCols">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "milk.png"} alt={"leche.png"} height="100px" className="maxwidth"></img></li>
                                                <li><strong>Bricks de leche</strong></li>
                                                <li>Cantidad: {this.state.milk.status}</li>
                                            </ul>
                                        </div>
                                        {
                                            this.state.cat1.map(product => (
                                                <div className="col-xl-2 col-md-3 col-sm-4 center-block bootCols" key={product.id}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li>Cantidad: {product.amount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <br/>
                                    <h3>Carnes, pescados y huevos</h3>
                                    <br/>
                                    <div className="row">
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "egg.png"} alt={"huevos.png"} height="100px" className="maxwidth"></img></li>
                                                <li><strong>Huevos</strong></li>
                                                <li>Cantidad: {this.state.egg.status}</li>
                                            </ul>
                                        </div>
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "sausage.png"} alt={"embutido.png"} height="100px" className="maxwidth"></img></li>
                                                <li><strong>Embutido</strong></li>
                                                <li>Peso: {this.state.sausage.status}</li>
                                            </ul>
                                        </div>
                                        {
                                            this.state.cat2.map(product => (
                                                <div className="col-xl-2 col-md-3 col-sm-4 center-block" key={product.id}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li>Cantidad: {product.amount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <br/>
                                    <h3>Patatas, legumbres, frutos secos</h3>
                                    <br/>
                                    <div className="row">
                                        {
                                            (this.state.cat3.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay productos en esta categoria.</em></h5></div> :
                                            this.state.cat3.map(product => (
                                                <div className="col-xl-2 col-md-3 col-sm-4 center-block" key={product.id}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li>Cantidad: {product.amount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <br/>
                                    <h3>Verduras y hortalizas</h3>
                                    <br/>
                                    <div className="row">
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "vegetable.png"} alt={"verdurascajonizquierdo.png"} height="100px" className="maxwidth"></img></li>
                                                <li><strong>Verduras del cajón izquierdo</strong></li>
                                                <li>Peso: {this.state.vegetableleft.status}</li>
                                            </ul>
                                        </div>
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "vegetable.png"} alt={"verdurascajonderecho.png"} height="100px" className="maxwidth"></img></li>
                                                <li><strong>Verduras del cajón derecho</strong></li>
                                                <li>Peso: {this.state.vegetableright.status}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <br/>
                                    <h3>Frutas</h3>
                                    <br/>
                                    <div className="row">
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "fruit.png"} alt={"frutacajonziquierdo.png"} height="100px" className="maxwidth" ></img></li>
                                                <li><strong>Frutas del cajón izquierdo</strong></li>
                                                <li>Peso: {this.state.fruitleft.status}</li>
                                            </ul>
                                        </div>
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "fruit.png"} alt={"frutacajonzderecho.png"} height="100px" className="maxwidth" ></img></li>
                                                <li><strong>Frutas del cajón derecho</strong></li>
                                                <li>Peso: {this.state.fruitright.status}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <br/>
                                    <h3>Cereales y derivados, azúcar y dulces</h3>
                                    <br/>
                                    <div className="row">
                                        <div className="col-xl-2 col-md-3 col-sm-4 center-block">
                                            <ul className="nopointul text-center">
                                                <li><img src={process.env.REACT_APP_IMAGES + "refreshment.png"} alt={"refrescos.png"} height="100px" className="maxwidth"></img></li>
                                                <li><strong>Refrescos</strong></li>
                                                <li>Cantidad: {this.state.refreshment.status}</li>
                                            </ul>
                                        </div>
                                        {
                                            this.state.cat6.map(product => (
                                                <div className="col-xl-2 col-md-3 col-sm-4 center-block" key={product.id}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li>Cantidad: {product.amount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <br/>
                                    <h3>Grasas, aceite y mantequilla</h3>
                                    <br/>
                                    <div className="row">
                                        {
                                            (this.state.cat7.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay productos en esta categoria.</em></h5></div> :
                                            this.state.cat7.map(product => (
                                                <div className="col-xl-2 col-md-3 col-sm-4 center-block" key={product.id}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li>Cantidad: {product.amount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return window.location.href= process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND
        }
    }
}