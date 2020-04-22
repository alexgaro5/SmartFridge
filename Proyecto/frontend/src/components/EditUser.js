//Importamos react, metodos comunes, axios, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import {getUrlVariables, isAdminConnected} from '../commonMethods';
import axios from 'axios';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de editar usuarios
export default class EditUser extends Component {

    //Creamos las variables user (para guardar el usuario a modificar), message (por si hay que mostrar alguno)
    //vars (para recoger la ID del usuario a modificar desde la dirección web) y update (la URL para hacer las peticiones necesarias al)
    state = {
        user: []
    }
    message = '';
    vars = getUrlVariables();
    update = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_USER + this.vars['user'];

    //Obtendrá el usuario que tenga la ID que hemos obtenido y la guardará en "product" para editarla mas tarde.
    getUser = async () => {
        console.log(this.update + "&false")
        const res = await axios.get(this.update + "&false");
        console.log(res)
        this.setState({user: res.data});
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
        if(this.vars['msg'] === 'sameemail') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_EDITUSER_EMAIL}</div>;
        if(this.vars['msg'] === 'sameusername') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_EDITUSER_USERNAME}</div>;
        if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_EDITUSER_SUCCESS}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getUser() para obtener los datos de la etiqueta y mostrarlos, y mas tarde modificarlos.
    async componentDidMount(){
        this.getUser();
    }

    render() { 
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isAdminConnected()){
            return( 
                <div className='container'>
                    <div className='col-sm-9 mx-auto'>
                        <div className='card mt-5'>
                            <div className="card-body">
                                <p className='my-auto'><a className='nolink' href="/user"><span className='fas fa-chevron-circle-left'></span></a></p>
                                <h2 className="text-center">
                                        <span className="fa fa-user-edit"></span>  Editar usuario
                                </h2>
                                
                                { this.Anuncio() }

                                <form action={this.update} method="post">
                                    <input type="hidden" name="id" value={this.vars['user']}/>
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" name="email" defaultValue={this.state.user.email} className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Nombre de usuario:</label>
                                        <input type="text" readOnly="readonly" name="username" defaultValue={this.state.user.username} className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña (introduce solo si quieres modificarla):</label>
                                        <input type="password" name="password" className="form-control"/>
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