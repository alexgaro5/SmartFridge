//Importamos react, metodos comunes, varaibles globales (dotenv).
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {isAdminConnected, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();

//La página de la barra de navegación
export default class Navigation extends Component {

    //Desloguea al usuario que este logueado.
    logout = async () => {
        if(window.confirm("¿Desea cerrar sesión?")){
            document.cookie = 'user=; max-age=0;';
            window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND;
        }
    }
    
    render() {
        //Si el admin está logueado se mostrará esta barra con todas las opciones, si no, no.
        if(isAdminConnected()){
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand " to="/">
                            <img src="logo.png" alt="Logo" height="34" width="34"></img>  SmartFridge
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="nav navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/product"> Productos </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/label"> Etiquetas </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/user"> Usuarios </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/database"> Datos </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/variable"> Variables </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="" onClick={() => this.logout()}>Cerrar sesión</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )
        //Si cualquier otro usuario está logueado se mostrará esta barra con algunas opciones, si no, no.
        }else if(isSomeoneConnected()){
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand " to="/">
                            <img src="logo.png" alt="Logo" height="34" width="34"></img>  SmartFridge
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="nav navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/product"> Productos </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/label"> Etiquetas </Link> 
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="//localhost:3000" onClick={() => this.logout()}>Cerrar sesión</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )
        //Si ningún usuario está logueado se mostrará esta barra con ninguna opción.
        }else{
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand " to="/">
                            <img src="logo.png" alt="Logo" height="34" width="34"></img>  SmartFridge
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>
            )
        }
    }
}
