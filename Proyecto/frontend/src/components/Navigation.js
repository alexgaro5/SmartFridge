//Importamos react, metodos comunes, axios y variables globales (dotenv).
import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import {isAdminConnected, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();

//La página de la barra de navegación
export default class Navigation extends Component {

    state = {
        usr: []
    }

    //Desloguea al usuario que este logueado.
    logout = async () => {
        if(window.confirm("¿Desea cerrar sesión?")){
            document.cookie = 'user=; max-age=0;';
            window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND;
        }
    }
    
    //Obtene datos del usuario conectado
    getUser = async () => {
        const usr = document.cookie.toString().split("=")[1];
        if(usr !== undefined){
            const usrObj = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_USER + usr);
            this.setState({usr: usrObj.data});
        }
    }

    //Cuando el componente esté montado, se llamará al método getUser() para obtener los datos del usurio conectado y mostrarlos, y mas tarde modificarlos.
    async componentDidMount(){
        this.getUser();
    }

    render() {
        //Si el admin está logueado se mostrará esta barra con todas las opciones, si no, no.
        if(isAdminConnected()){
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand border-md-right" to="/">
                        <img src="logo.png" alt="Logo" height="34" width="34"></img>&nbsp;SmartFridge&nbsp;&nbsp;&nbsp;
                    </Link>
                    <div className="ml-auto">
                        <p style={{marginBottom: 5}} className="navbar-brand" ><em>Bienvenido, {this.state.usr.username}</em></p> 
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/product">Productos</Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/label"> Etiquetas </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/shoppinglist"> Lista de la compra </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/activity"> Actividad </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/diet"> Dieta </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/user"> Usuarios </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/database"> Datos </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link border-md-right active" to="/variable"> Variables </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="" onClick={() => this.logout()}><span className="fas fa-power-off"></span> Cerrar sesión</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            )
        //Si cualquier otro usuario está logueado se mostrará esta barra con algunas opciones, si no, no.
        }else if(isSomeoneConnected()){
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand border-md-right" to="/">
                        <img src="logo.png" alt="Logo" height="34" width="34"></img>&nbsp;SmartFridge&nbsp;&nbsp;&nbsp;
                    </Link>
                    <div className="ml-auto">
                        <p style={{marginBottom: 5}} className="navbar-brand" ><em>Bienvenido, {this.state.usr.username}</em></p> 
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/product"> Productos </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/label"> Etiquetas </Link> 
                            </li>
                            <li className="nav-item">
                            <   Link className="nav-link active" to="/shoppinglist"> Lista de la compra </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/activity"> Actividad </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link border-md-right active" to="/diet"> Dieta </Link> 
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="//localhost:3000" onClick={() => this.logout()}><span className="fas fa-power-off"></span> Cerrar sesión</Link>
                            </li>
                        </ul>
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
                        
                    </div>
                </nav>
            )
        }
    }
}
