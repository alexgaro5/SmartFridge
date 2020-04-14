//Importamos react, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import axios from 'axios'
import {isSomeoneConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página principal
export default class Main extends Component {
    
    //Usamos la variable sl(para guardar la lista de la compra guardada en el backend para mostrar) y act (la actividad del usuario para mostrarla)
    state = {
        sl: [],
        act: []
    }

    //Envia una peticion para obtener la lista de la compra y añadirla a la variable "sl"
    getShoppingList = async () => {
        const sl = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_SHOPPINGLIST);
        this.setState({sl: sl.data});
    }

    //Envia una peticion para obtener la actividad del usuario que está logueado y añadirla a la variable "act"
    getActivity = async () => {
        const usr = document.cookie.toString().split("=")[1];
        if(usr !== undefined){
            const act = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_ACTIVITY + usr);
            this.setState({act: act.data});
        }
    }

    //Envia una peticion para eliminar la actividad del usuario que está logueado.
    deleteActivity = async () => {
        const usr = document.cookie.toString().split("=")[1];
        if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_ACTIVITY)) {
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_ACTIVITY + usr);
            this.getActivity();
        }
    }

    //Cuando el componente esté montado, se llamará al método getShoppingList() y getActivity() para obtener los datos de la etiqueta y productos y mostrarlos
    async componentDidMount(){
        this.getShoppingList();
        this.getActivity();
        setInterval(() => this.getShoppingList(), 1000);
        setInterval(() => this.getActivity(), 1000);
    }

    render() {
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return (
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header text-center">
                                <strong className="title" >LISTA DE LA COMPRA</strong>
                            </div>
                            <ul className="list-group">
                                {
                                this.state.sl.map(product =>  (
                                    <li className="list-group-item" key={product._id}>
                                        <span className="my-auto" style={{marginRight: 10}}> {product.name}</span>
                                    </li>
                                ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header text-center">
                                <strong className="title">PRODUCTOS CONSUMIDOS <button className="float-right btn btn-danger btn-sm" onClick={() => this.deleteActivity()}><span className="fas fa-trash-alt"></span></button></strong>
                            </div>
                            <ul className="list-group">
                                {
                                this.state.act.map(activity =>  (
                                    <li className="list-group-item" key={activity.productName}>
                                        <span className="my-auto" style={{marginRight: 10}}>{activity.date.split("T")[0].split("-")[2] + "/" + activity.date.split("T")[0].split("-")[1] + "/" + activity.date.split("T")[0].split("-")[0] + " " + (parseInt(activity.date.split("T")[1].split(":")[0], 10)+1) + ":" + activity.date.split("T")[1].split(":")[1] + ":" + activity.date.split("T")[1].split(".")[0].split(":")[2]}: {activity.productName}</span>
                                    </li>
                                ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }else{
            return window.location.href= process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND
        }
    }
}