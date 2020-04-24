//Importamos react, metodos comunes, axios, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
import axios from 'axios';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de editar dieta
export default class EditDiet extends Component {

    //Creamos las variables diet (para guardar la dieta a modificar), message (por si hay que mostrar alguno)
    //vars (para recoger la ID de la dieta a modificar desde la dirección web) y update (la URL para hacer las peticiones necesarias al backend)
    state = {
        diet: [],
    }
    message = '';
    vars = getUrlVariables();
    update = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_DIETFRONTEND2 + this.vars['diet'];

    //Obtendrá el producto de la dieta que tenga la ID que hemos obtenido y la guardará en "diet" para editarla mas tarde.
    getDiet = async () => {
        const diet = await axios.get(this.update);

        if(diet.data[0].productId !== undefined){
            const product = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + diet.data[0].productId  + "&false");
            diet.data[0].name = product.data.name;
        }

        this.setState({diet: diet.data[0]});
    }

    //Es un método que sirve para cambiar el valor del input de la variable con ayuda de botones.
    modifyAmount(name, delta) {
        const valor = parseInt(document.form[name].value);
        delta = parseInt(delta);

        if(valor !== 0 || delta !== -1){
            document.form[name].value = parseInt(valor)+parseInt(delta);
        }
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
        if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_EDITDIET_SUCCESS}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getDiet() para obtener los datos de la etiqueta y mostrarlos, y mas tarde modificarlos.
    async componentDidMount(){
        this.getDiet();
    }

    render() { 
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return( 
                <div className='container'>
                    <div className='col-sm-9 mx-auto'>
                        <div className='card mt-5'>
                            <div className="card-body">
                                <p className='my-auto'><a className='nolink' href="/diet"><span className='fas fa-chevron-circle-left'></span></a></p>
                                <h2 className="text-center">
                                        <span className="fas fa-pen"></span>  Editar producto de la dieta
                                </h2>
                                
                                { this.Anuncio() }

                                <form action={this.update} method="post" name="form">
                                    <input type="hidden" name="end" value='false'/>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre:</label>
                                        <input type="text" name="nameProduct" defaultValue={this.state.diet.name} readOnly="readonly" className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Cantidad a consumir por día:</label>
                                        <input type="number" name="amountPerDay" defaultValue={this.state.diet.amountPerDay} min='1' max='100' className="form-control" required/>
                                        <div className="text-center">
                                            <p style={{marginTop: 10}}><em>Se modificará automáticamente el parámetro de cantidad restante a consumir</em></p>
                                            <input style={{marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount("amountPerDay", -1)}></input> 
                                            <input  type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount("amountPerDay", +1)}></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Cantidad restante a consumir:</label>
                                        <input type="number" name="remainingAmount" defaultValue={this.state.diet.remainingAmount} min='0' max='100' className="form-control" required/>
                                        <div className="text-center">
                                            <input style={{marginTop: 10, marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount("remainingAmount", -1)}></input> 
                                            <input style={{marginTop: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount("remainingAmount", +1)}></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Parte del día:</label>
                                        <select  className="form-control" name="partOfDay" required>
                                            {(this.state.diet.partOfDay === 0) ? <option value="0" selected>Mañana</option> : <option value="0">Mañana</option>}
                                            {(this.state.diet.partOfDay === 1) ? <option value="1" selected>Tarde</option> : <option value="1">Tarde</option>}
                                            {(this.state.diet.partOfDay === 2) ? <option value="2" selected>Noche</option> : <option value="2">Noche</option>}
                                        </select>
                                    </div>
                                    <br/>
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