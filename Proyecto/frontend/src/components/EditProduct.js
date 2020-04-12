//Importamos react, metodos comunes, axios, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
import axios from 'axios';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de editar productos
export default class EditProduct extends Component {

    //Creamos las variables product (para guardar el producto a modificar), message (por si hay que mostrar alguno)
    //vars (para recoger la ID del producto a modificar desde la dirección web) y update (la URL para hacer las peticiones necesarias al)
    state = {
        product: []
    }
    message = '';
    vars = getUrlVariables();
    update = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + this.vars['product'];

    //Obtendrá el producto que tenga la ID que hemos obtenido y la guardará en "product" para editarla mas tarde.
    getProduct = async () => {
        const res = await axios.get(this.update);
        this.setState({product: res.data});
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
        if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_EDITPRODUCT_SUCCESS}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getProduct() para obtener los datos de la etiqueta y mostrarlos, y mas tarde modificarlos.
    async componentDidMount(){
        this.getProduct();
    }

    render() { 
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return( 
                <div className='container'>
                    <div className='col-sm-9 mx-auto'>
                        <div className='card mt-5'>
                            <div className="card-body">
                                <p className='my-auto'><a className='nolink' href="/product"><span className='fas fa-chevron-circle-left'></span></a></p>
                                <h2 className="text-center">
                                        <span className="fas fa-pen"></span>  Editar producto
                                </h2>
                                
                                { this.Anuncio() }

                                <form action={this.update} method="post">
                                    <input type="hidden" name="end" value="false"/>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre:</label>
                                        <input type="text" name="name" defaultValue={this.state.product.name} className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Cantidad:</label>
                                        <input type="number" name="amount" defaultValue={this.state.product.amount} min='0' max='100' className="form-control" required/>
                                    </div>
                                    <div className='text-center'>
                                        <input type="submit" value="Editar" className="btn btn-primary btn-lg" />
                                    </div>
                                </form>
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