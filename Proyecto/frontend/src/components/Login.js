//Importamos react, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import {getUrlVariables} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de Login
export default class Login extends Component {
    
    //Usamos la variable message (por si hay que mostrar alguno) y vars (para recoger variables desde la dirección web)
    message = '';
    vars = getUrlVariables();

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
            if(this.vars['msg'] === 'noaccount') this.message = process.env.REACT_APP_NO_USER
            if(this.vars['msg'] === 'wrongpass') this.message = process.env.REACT_APP_WRONG_PASS;
            return <div className="alert alert-danger text-center">{this.message}</div>;
        }
        return null;
    }

    render() { 
        return( 
            <div className='container'>
                <div className='col-sm-9 mx-auto'>
                    <div className='card mt-5'>
                        <div className="card-body">
                            <h2 className="text-center">
                                    <span className="fa fa-sign-in-alt"></span>  Bienvenido a SmartFridge
                            </h2>

                            { this.Anuncio() }

                            <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LOGIN} method="post">
                                    <div className="form-group">
                                        <label htmlFor="email">Email/Usuario:</label>
                                        <input type="text" name="emailOrUsername" className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña:</label>
                                        <input type="password" name="password" className="form-control" required/>
                                    </div>
                                    <div className='text-center'>
                                        <input type="submit" value="Iniciar sesión" className="btn btn-dark btn-lg" />
                                    </div>
                            </form>
                            <hr/>
                            <div className="text-center">
                                <p>{process.env.REACT_APP_FORGET_PASS} <a href="/forget">{process.env.REACT_APP_RECOVER_PASS}</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}