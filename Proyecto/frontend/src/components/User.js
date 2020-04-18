import React, { Component } from 'react';
import axios from 'axios';
import {getUrlVariables, isAdminConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all');

//La página de usuarios
export default class User extends Component {
    
    //Vamos a teneruna varaible users, para guardar todos los usuarios ppara mostrarlos.
    //Ademas, tenemos la variable message por si hay que mostrar alguno y vars para obtener las varaibles de la dirección web
    state = {
        users: []
    }
    message = '';
    vars = getUrlVariables();

    //Envia la petición para obtener todos los usuarios registrados.
    getUsers = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_USER);
        this.setState({users: res.data});
    }

    //Reenvia a la página para editar el usuario
    editUser = async (id, name) => {
        if(name === "admin"){
            window.alert(process.env.REACT_APP_NO_ADMIN_EDIT)
        }else{
            window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND + process.env.REACT_APP_EDITUSER + id;
        }  
    }

    //Envia la petición para eliminar el usuario que pasan por parámetro.
    deleteUser = async (id, name) => {
        if(name === "admin"){
            window.alert(process.env.REACT_APP_NO_ADMIN_DELETE)
        }else if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_USER + "'" + name + "'?")) {
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_USER + id);
            this.getUsers();
        }
    }

    //Envia la petición para añadir un usuario a una tarjeta
    addCard = async (name) => {
        window.alert(process.env.REACT_APP_ADD_USER_IN_CARD);
        await axios.post(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_CARD + name + '&true');
    }

    //Envia la petición para eliminar un usuario de una tarjeta
    deleteCard = async () => {
        window.alert(process.env.REACT_APP_DELETE_USER_IN_CARD);
        await axios.post(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_CARD + 'null&false');
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
            if(this.vars['msg'] === 'sameemail') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_SAME_EMAIL}</div>;
            if(this.vars['msg'] === 'sameusername') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_SAME_USERNAME}</div>;
            if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_USER_ADDED}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getUsers() para obtener los datos de los usuarios y mostrarlos
    async componentDidMount(){
        this.getUsers();
    }

    render() {
        //Si el usuario admin esta logueado se mostrará la página, si no, no.
        if(isAdminConnected()){
            return (
                <div id="accordion">
                    <div className="row">
                        <div className="col-md-12">

                            { this.Anuncio() }

                            <div className="card">
                                <button className="btn" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <h4 id="headingOne" className="mb-0">
                                        <span className="fas fa-plus-square"></span> Añadir nuevo usuario
                                    </h4>
                                    <span className="fas fa-chevron-circle-down"></span>
                                </button>

                                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                    
                                    <div className="card-body">

                                    <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_USER} method="post">
                                        <div className="form-group">
                                            <label htmlFor="email">Email:</label>
                                            <input type="email" name="email" className="form-control" required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Nombre de usuario:</label>
                                            <input type="text" pattern="[a-zA-Z0-9]+" title="Solo de admiten letras y números." maxLength="15" name="username" className="form-control" required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Contraseña:</label>
                                            <input type="password" name="password" className="form-control" required/>
                                        </div>
                                        <div className='text-center'>
                                            <input type="submit" value="Añadir" className="btn btn-primary btn-lg" />
                                        </div>
                                    </form>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: 15}} className="card">
                                <div className="card-body">
                                <h2>Usuarios existentes: <button className="float-right btn btn-danger btn-sm" onClick={() => this.deleteCard()}><span className="far fa-credit-card"></span> Eliminar tarjeta</button></h2>
                                    <ul className="list-group">
                                        {
                                            this.state.users.map(user => (
                                                <li className="list-group-item" key={user._id}>
                                                    <span className="my-auto"><strong>Nombre de usuario:</strong> {user.username}{user.card ? <span style={{marginLeft: 5}} className='far fa-credit-card'></span> : ""}</span>
                                                    <button className="float-right btn btn-danger btn-sm" onClick={() => this.deleteUser(user._id , user.username)}><span className="fa fa-user-minus"></span></button>
                                                    <button className="float-right btn btn-primary btn-sm" style={{marginRight: 5}} onClick={() => this.editUser(user._id, user.username)}><span className="fa fa-user-edit"></span></button>
                                                    <button className="float-right btn btn-success btn-sm" style={{marginRight: 30}} onClick={() => this.addCard(user.username)}><span className="far fa-credit-card"></span></button>
                                                </li>
                                            ))
                                        }
                                    </ul>
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
