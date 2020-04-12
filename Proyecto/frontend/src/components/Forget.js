//Importamos react, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import {getUrlVariables} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de contraseña olvidada
export default class Forget extends Component {
    
    //Usamos la variable message (por si hay que mostrar alguno) y vars (para recoger variables desde la dirección web)
    message = '';
    vars = getUrlVariables();

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){
        if(this.vars['msg'] != null){
        if(this.vars['msg'] === 'noaccount') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_NO_USER}</div>;
        if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_FORGET_SUCCESS}</div>;
            return this.message;
        }
        return null;
    }
    //Si hay alguien logueado se mostrará la página, si no, no.
    render() { 
        return( 
            <div className='container'>
                <div className='col-sm-9 mx-auto'>
                    <div className='card mt-5'>
                        <div className='card-header'>
                            <p className='my-auto'><a className='nolink' href="/login"><span className='fas fa-chevron-circle-left'></span></a></p>
                        </div>
                        <div className="card-body">
                            <h2 className="text-center">
                                    <span className="fas fa-key"></span>  Recuperar contraseña
                            </h2>

                            <br/>
                            
                            { this.Anuncio() }

                            <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_FORGET} method="post">
                                    <div className="form-group">
                                        <label htmlFor="email">Email/Usuario:</label>
                                        <input type="text" name="emailOrUsername" className="form-control" required/>
                                    </div>
                                    <br/>
                                    <div className='text-center'>
                                        <input type="submit" value="Recuperar contraseña" className="btn btn-dark btn-lg" />
                                    </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
