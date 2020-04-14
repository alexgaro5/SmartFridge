//Importamos react, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react';
import {getUrlVariables} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de recuperar contraseña
export default class Recover extends Component {
    
    //Usamos la variable message (por si hay que mostrar alguno) y vars (para recoger variables desde la dirección web)
    message = '';
    vars = getUrlVariables();

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){
        if(this.vars['msg'] != null){
            if(this.vars['msg'] === 'wrongpassword') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_SAME_PASS}</div>;
            if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_PASS_CHANGED}</div>;
            return this.message;
        }
        return null;
    }

    render() { 
        return( 
            <div className='container'>
                <div className='col-sm-9 mx-auto'>
                    <div className='card mt-5'>
                        <div className='card-header'>
                            <p className='my-auto'><a className='nolink' href="/forget"><span className='fas fa-chevron-circle-left'></span></a></p>
                        </div>
                        <div className="card-body">
                            <h2 className="text-center">
                                    <span className="fas fa-key"></span>  Recuperar contraseña
                            </h2>

                            <br/>
                            
                            { this.Anuncio() }

                            <form action= {process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_RECOVER} method="post">
                                    <input type="hidden" name="email" value={this.vars['email']}/>
                                    <div className="form-group">
                                        <label htmlFor="password">Código de recuperación (revisa tu correo):</label>
                                        <input type="text" name="token" className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña:</label>
                                        <input type="password" name="password" className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Repetir la contraseña:</label>
                                        <input type="password" name="password2" className="form-control" required/>
                                    </div>
                                    <div className='text-center'>
                                        <input type="submit" value="Cambiar contraseña" className="btn btn-dark btn-lg" />
                                    </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
