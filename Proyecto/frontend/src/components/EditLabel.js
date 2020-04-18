
//Importamos react, metodos comunes, axios, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
import axios from 'axios';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de editar etiquetas
export default class EditLabel extends Component {

    //Creamos las variables label (para guardar la etiqueta a modificar), message (por si hay que mostrar alguno)
    //vars (para recoger la ID de la etiqueta a modificar desde la dirección web) y update (la URL para hacer las peticiones necesarias al)
    state = {
        label: [],
        name: ''
    }
    message = '';
    vars = getUrlVariables();
    update = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LABEL + this.vars['label'];

    //Obtendrá la etiqueta que tenga la ID que hemos obtenido y la guardará en "label" para editarla mas tarde.
    getLabel = async () => {
        const res = await axios.get(this.update);
        this.setState({label: res.data});

        const product = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + this.state.label.idProduct);
        this.setState({name: product.data.name});
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
        if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_EDITLABEL_SUCCESS}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getLabel() para obtener los datos de la etiqueta y mostrarlos, y mas tarde modificarlos.
    async componentDidMount(){
        this.getLabel();
    }

    render() { 
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return( 
                <div className='container'>
                    <div className='col-sm-9 mx-auto'>
                        <div className='card mt-5'>
                            <div className="card-body">
                                <p className='my-auto'><a className='nolink' href="/label"><span className='fas fa-chevron-circle-left'></span></a></p>
                                <h2 className="text-center">
                                        <span className="fas fa-pen"></span>  Editar etiqueta
                                </h2>
                                
                                { this.Anuncio() }

                                <form action={this.update} method="post" name="form">
                                    <input type="hidden" name="end" value='false'/>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre:</label>
                                        <input type="text" name="nameProduct" defaultValue={this.state.name} readOnly="readonly" className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Cantidad:</label>
                                        <input type="number" name="amount" defaultValue={this.state.label.amount} min='0' max='100' className="form-control" required/>
                                    </div>
                                    <div className="text-center">
                                        <input style={{marginTop: 5, marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-1)}></input> 
                                        <input style={{marginTop: 5}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+1)}></input>
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