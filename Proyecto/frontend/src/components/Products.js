//Importamos react, axios, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import axios from 'axios'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de productos
export default class Products extends Component {

    //Vamos a tener variables para guardar los diferentes productos que puede haber dentro de la nevera y luego mostrarlos
    //Ademas, tenemos la variable message por si hay que mostrar alguno y vars para obtener las varaibles de la dirección web
    state = {
        products: [],
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
        this.setState({products: res.data});
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
        if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_PRODUCT + "'" + name + "'?")) {
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + id);
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
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header text-center">
                                <h4><span className="fas fa-plus-square"></span> Añadir nuevo producto</h4>
                            </div>
                            <div className="card-body">
                                
                                { this.Anuncio() }

                                <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT} method="post">
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre de producto:</label>
                                        <input type="text" name="name" className="form-control" required/>
                                    </div>
                                    <div className='text-center'>
                                        <input type="submit" value="Añadir" className="btn btn-primary btn-lg" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h2>Productos existentes:</h2>
                        <ul className="list-group">
                            {
                                this.state.products.map(product => (
                                    <li className="list-group-item" key={product.id}>
                                        <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> {product.name}</span>
                                        <span className="my-auto"><strong>Cantidad:</strong> {product.amount}</span>
                                        <button className="float-right btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button>
                                        <button className="float-right btn btn-primary btn-sm" style={{marginRight: 10}} onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button>
                                    </li>
                                ))
                            }
                            <li className="list-group-item" key="levelwater">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Depósito de agua</span>
                                <span className="my-auto"><strong>Estado:</strong> {this.state.levelwater.status ? "Lleno" : "Vacio"}</span>
                            </li>
                            <li className="list-group-item" key="sausage">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Embutido</span>
                                <span className="my-auto"><strong>Peso:</strong> {this.state.sausage.status}</span>
                            </li>
                            <li className="list-group-item" key="egg">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Huevos</span>
                                <span className="my-auto"><strong>Cantidad:</strong> {this.state.egg.status}</span>
                            </li>
                            <li className="list-group-item" key="refreshment">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Refrescos</span>
                                <span className="my-auto"><strong>Cantidad:</strong> {this.state.refreshment.status}</span>
                            </li>
                            <li className="list-group-item" key="milk">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Leche</span>
                                <span className="my-auto"><strong>Cantidad:</strong> {this.state.milk.status}</span>
                            </li>
                            <li className="list-group-item" key="vegetableleft">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Cajón de verdura izquierdo</span>
                                <span className="my-auto"><strong>Peso:</strong> {this.state.vegetableleft.status}</span>
                            </li>
                            <li className="list-group-item" key="vegetableright">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Cajón de verdura derecho</span>
                                <span className="my-auto"><strong>Peso:</strong> {this.state.vegetableright.status}</span>
                            </li>
                            <li className="list-group-item" key="fruitleft">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Cajón de fruta izquierdo</span>
                                <span className="my-auto"><strong>Peso:</strong> {this.state.fruitleft.status}</span>
                            </li>
                            <li className="list-group-item" key="fruitright">
                                <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> Cajón de fruta derecho</span>
                                <span className="my-auto"><strong>Peso:</strong> {this.state.fruitright.status}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }else{
            return window.location.href= process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND
        }
    }
}