//Importamos react, metodos comunes, varaibles globales (dotenv).
import React, { Component } from 'react'
import axios from 'axios'
import {isSomeoneConnected} from '../commonMethods';
require('dotenv').config();

//La página de la lista de la compra
export default class ShoppingList extends Component {
    
    //Usamos la variable sl(para guardar la lista de la compra) y el slToShow(Para recoger la información de cada sl y mostrarla).
    state = {
        sl: [],
        slToShow: []
    }

    //Envia una peticion para obtener la lista de la compra y añadirla a la variable "sl"
    getShoppingList = async () => {
        const sl = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_SHOPPINGLIST);
        this.setState({sl: sl.data});

        this.state.sl.map(async (product) => {
            var productToAdd = {};

            if(product.id === 'product'){
                const pr = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + product.idProduct);
                productToAdd.name = pr.data.name;
                productToAdd.imageUrl = pr.data.imageUrl;
            }else{
                productToAdd.name = product.name;
                productToAdd.imageUrl = product.imageUrl;
            }

            this.setState({slToShow: this.state.slToShow.concat(productToAdd)});
        })

    }

    //Cuando el componente esté montado, se llamará al método getShoppingList() para obtener los datos de los usuarios y mostrarlos
    async componentDidMount(){
        this.getShoppingList();
    }

    render() {
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return (
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header text-center">
                                <strong className="title" >LISTA DE LA COMPRA</strong>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {
                                        (this.state.slToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay productos para comprar.</em></h5></div> :
                                        this.state.slToShow.map(product => (
                                            <div className="col-xl-2 col-md-4 col-sm-6 center-block" key={product.name}>
                                                <ul className="nopointul text-center">
                                                    <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                    <li><strong>{product.name}</strong></li>
                                                </ul>
                                            </div>
                                        ))
                                    }
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