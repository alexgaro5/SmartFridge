import React, { Component } from 'react';
import axios from 'axios';
import {isAdminConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all');

//La página de tablas
export default class Tables extends Component {
    
    //Envia la petición para eliminar todos los registros del cajón de fruta.
    deleteFruits = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_FRUITLEFT);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_FRUITRIGHT);
    }

    //Envia la petición para eliminar todos los registros del cajón de verdura.
    deleteVegetables = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_VEGETABLESLEFT);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_VEGETABLESRIGHT);
    }

    //Envia la petición para eliminar todos los registros del cajón de embutido.
    deleteSausages = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_SAUSAGES);
    }

    //Envia la petición para eliminar todos los registros de los refrescos.
    deleteRefreshments = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_REFRESHMENTS);
    }

    //Envia la petición para eliminar todos los registros del deposito de agua.
    deleteWater = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LEVELWATER);
    }

    //Envia la petición para eliminar todos los registros de la leche.
    deleteMilk = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_MILK);
    }

    //Envia la petición para eliminar todos los registros de los huevos.
    deleteEggs = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_EGGS);
    }

    //Envia la petición para eliminar todos los registros de la lista de la compra.
    deleteShoppingList = async () => {
        window.alert(process.env.REACT_APP_RESET_SUCCESS);
        await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_SHOPPINGLIST);
    }

    render() {
        //Si el usuario admin esta logueado se mostrará la página, si no, no.
        if(isAdminConnected()){
            return (
                <div className="container">
                    <div className='col-sm-9 mx-auto'>
                        <div className='card mt-5'>
                            <div className="card-body">
                                <div className="text-center">
                                    <h4><span className="fas fa-table"></span> Limpiar tablas</h4>

                                    <hr/>

                                    <div className="btn-toolbar">
                                    <div className="btn-group-vertical mx-auto" style={{alignItems: 'center'}}>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteFruits()}>Fruta</button>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteVegetables()}>Verdura</button>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteSausages()}>Embutidos</button>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteRefreshments()}>Refrescos</button>
                                    </div>
                                    <div className="btn-group-vertical mx-auto" style={{alignItems: 'center'}}>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteWater()}>Agua</button>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteMilk()}>Leche</button>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteEggs()}>Huevos</button>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{marginBottom: 5}} onClick={() => this.deleteShoppingList()}>Lista de la compra</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND
        }
    }
}
