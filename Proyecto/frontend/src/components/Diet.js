//Importamos react, metodos comunes, varaibles globales (dotenv).
import React, { Component } from 'react'
import axios from 'axios'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();

//La página de la actividad de un usuario
export default class Diet extends Component {
    
    //Usamos la variable sl(para guardar la lista de la compra) y el slToShow(Para recoger la información de cada sl y mostrarla).
    state = {
        products: [],
        diet: [],
        dietMorningToShow: [],
        dietAfternoonToShow: [],
        dietNightToShow: [],
        daySelected: '',
        partOfDaySelected: ''
    }
    message = '';
    vars = getUrlVariables();

    //Obtiene todas las etiquetas existentes para ponerlas como opcion de selección en el formulario.
    getProducts = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT);
        this.setState({products: res.data});
    }

    //Envia una peticion para obtener la lista de la compra y añadirla a la variable "sl"
    getDiet = async () => {
        const usr = document.cookie.toString().split("=")[1];

        this.setState({dietMorningToShow: []});
        this.setState({dietAfternoonToShow: []});
        this.setState({dietNightToShow: []});

        if(usr !== undefined){
            const diet = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_DIETFRONTEND + usr);
            this.setState({diet: diet.data});
            
            this.state.diet.map(async product => {

                if(product.day === parseInt(this.state.daySelected)){
                    if(product.productId != null){
                        const pr = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + product.productId + "&false");
    
                        product.name = pr.data.name;
                        product.imageUrl = pr.data.imageUrl;
                    }
    
                    if(product.partOfDay === 0){
                        this.setState({dietMorningToShow: this.state.dietMorningToShow.concat(product)});
                    }else if(product.partOfDay === 1){
                        this.setState({dietAfternoonToShow: this.state.dietAfternoonToShow.concat(product)});
                    }else{
                        this.setState({dietNightToShow: this.state.dietNightToShow.concat(product)});
                    }
                }
            })
        }
    }

    getActualDate = () => {
        var now = new Date();     
        var day = now.getDay();
        var hour = now.getHours();
        
        if(hour >= 8 && hour < 12){
            this.setState({partOfDaySelected: 0});
        }else if(hour >= 12 && hour < 20){
            this.setState({partOfDaySelected: 1});
        }else{
            this.setState({partOfDaySelected: 2});
        }

        this.setState({daySelected: day});
    }

    onChange = () => {
        this.setState({daySelected: document.formdate.day.value});
        this.getDiet();
    }

    //Es un método que sirve para cambiar el valor del input de la variable con ayuda de botones.
    modifyAmount(name, delta) {
        const valor = parseInt(document.form[name].value);
        delta = parseInt(delta);

        if(valor !== 0 || delta !== -1){
            document.form[name].value = parseInt(valor)+parseInt(delta);
        }
    }

    //Reenvia a la pagina de edición del producto.
    editProduct = async (id) => {
        window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND + process.env.REACT_APP_EDITDIET + id;
    }

    //Elimina el producto pasado por parámetro
    deleteProduct = async (id, name) => {
        if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_DIETPRODUCT + "'" + name + "'? ")){
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_DIETFRONTEND + id);
            this.getDiet();
        }
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
            if(this.vars['msg'] === 'samename') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_SAME_DIETPRODUCT}</div>;
            if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_DIETPRODUCT_ADDED}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getActivity() para obtener los datos de los usuarios y mostrarlos
    async componentDidMount(){
        this.getActualDate();
        this.getProducts();
        this.getDiet();
    }

    render() {
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return (
                <div id="accordion">
                    <div className="row">
                        <div className="col-sm-12">

                            { this.Anuncio() }

                            <div className="card">
                                <button className="btn" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <h4 id="headingOne" className="mb-0">
                                        <span className="fas fa-plus-square"></span> Añadir producto a la dieta
                                    </h4>
                                    <span className="fas fa-chevron-circle-down"></span>
                                </button>

                                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                    
                                    <div className="card-body">

                                        <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_DIETFRONTEND} method="post" name="form">
                                            <input type="hidden" name="userId" value={document.cookie.toString().split("=")[1]}/>
                                            <div className="form-group">
                                                <label htmlFor="name">Producto:</label>
                                                <select className="form-control" name="productId" required>
                                                    <option value="Leche">Leche</option>
                                                    <option value="Refresco">Refresco</option>
                                                    <option value="Huevo">Huevo</option>
                                                    <option value="Fruta">Fruta</option>
                                                    <option value="Verdura">Verdura</option>
                                                    <option value="Embutido">Embutido</option>
                                                    {
                                                        this.state.products.map(product => 
                                                        <option key={product._id} value={product._id}> 
                                                            {product.name}
                                                        </option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Cantidad a consumir por día:</label>
                                                <input type="number" name="amountPerDay" defaultValue='1' min='1' max='100' className="form-control" required/>
                                                <div className="text-center">
                                                    <input style={{marginTop: 10, marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount("amountPerDay", -1)}></input> 
                                                    <input style={{marginTop: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount("amountPerDay", +1)}></input>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Cantidad restante a consumir:</label>
                                                <input type="number" name="remainingAmount" defaultValue='1' min='1' max='100' className="form-control" required/>
                                                <div className="text-center">
                                                    <input style={{marginTop: 10, marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount("remainingAmount", -1)}></input> 
                                                    <input style={{marginTop: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount("remainingAmount", +1)}></input>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Dieta de la semana:</label>
                                                <select  className="form-control" name="day" defaultValue={this.state.daySelected} required>
                                                    {(this.state.daySelected === 1) ? <option value="1" selected>Lunes</option> : <option value="1">Lunes</option>}
                                                    {(this.state.daySelected === 2) ? <option value="2" selected>Martes</option> : <option value="2">Martes</option>}
                                                    {(this.state.daySelected === 3) ? <option value="3" selected>Miércoles</option> : <option value="3">Miércoles</option>}
                                                    {(this.state.daySelected === 4) ? <option value="4" selected>Jueves</option> : <option value="4">Jueves</option>}
                                                    {(this.state.daySelected === 5) ? <option value="5" selected>Viernes</option> : <option value="5">Viernes</option>}
                                                    {(this.state.daySelected === 6) ? <option value="6" selected>Sábado</option> : <option value="6">Sábado</option>}
                                                    {(this.state.daySelected === 0) ? <option value="0" selected>Domingo</option> : <option value="0">Domingo</option>}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Parte del día:</label>
                                                <select  className="form-control" name="partOfDay" defaultValue={this.state.partOfDaySelected} required>
                                                    {(this.state.partOfDaySelected === 0) ? <option value="0" selected>Mañana</option> : <option value="0">Mañana</option>}
                                                    {(this.state.partOfDaySelected === 1) ? <option value="1" selected>Tarde</option> : <option value="1">Tarde</option>}
                                                    {(this.state.partOfDaySelected === 2) ? <option value="2" selected>Noche</option> : <option value="2">Noche</option>}
                                                </select>
                                            </div>
                                            <div className='text-center'>
                                                <input type="submit" value="Añadir" className="btn btn-primary btn-lg" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div style={{marginTop: 15}} className="card">
                                <div className="card-header text-center">
                                    <strong className="title" >DIETA DEL USUARIO</strong>
                                </div>
                                <div className="card-body">
                                    <div className="col-sm-12 my-auto text-center">
                                        <form name="formdate">
                                            <div className="form-group">
                                                <label htmlFor="name">Introduzca el día de la semana para ver la dieta:</label>
                                                <select  className="form-control" id="day" onChange={this.onChange} required>
                                                    {(this.state.daySelected === 1) ? <option value="1" selected>Lunes</option> : <option value="1">Lunes</option>}
                                                    {(this.state.daySelected === 2) ? <option value="2" selected>Martes</option> : <option value="2">Martes</option>}
                                                    {(this.state.daySelected === 3) ? <option value="3" selected>Miércoles</option> : <option value="3">Miércoles</option>}
                                                    {(this.state.daySelected === 4) ? <option value="4" selected>Jueves</option> : <option value="4">Jueves</option>}
                                                    {(this.state.daySelected === 5) ? <option value="5" selected>Viernes</option> : <option value="5">Viernes</option>}
                                                    {(this.state.daySelected === 6) ? <option value="6" selected>Sábado</option> : <option value="6">Sábado</option>}
                                                    {(this.state.daySelected === 0) ? <option value="0" selected>Domingo</option> : <option value="0">Domingo</option>}
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                    <h3 className="text-center col-sm-12">Mañana</h3>
                                    <br/>
                                    <div className="row">
                                        {
                                            (this.state.dietMorningToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay una dieta para el usuario en la mañana.</em></h5></div> :
                                            this.state.dietMorningToShow.map(product => (
                                                <div className="col-xl-3 col-md-4 col-sm-6 center-block" key={product.name}>
                                                    <ul className="nopointul text-center">
                                                    <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li><strong>Cantidad diaria: </strong>{product.amountPerDay}</li>
                                                        <li><strong>Cantidad restante: </strong>{product.remainingAmount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>  
                                    <br/>
                                    <h3 className="text-center col-sm-12">Tarde</h3>
                                    <br/>
                                    <div className="row">
                                        {
                                            (this.state.dietAfternoonToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay una dieta para el usuario en la tarde.</em></h5></div> :
                                            this.state.dietAfternoonToShow.map(product => (
                                                <div className="col-xl-3 col-md-4 col-sm-6 center-block" key={product.name}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li><strong>Cantidad diaria: </strong>{product.amountPerDay}</li>
                                                        <li><strong>Cantidad restante: </strong>{product.remainingAmount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>  
                                    <br/>
                                    <h3 className="text-center col-sm-12">Noche</h3>
                                    <br/>
                                    <div className="row">
                                        {
                                            (this.state.dietNightToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay una dieta para el usuario en la noche.</em></h5></div> :
                                            this.state.dietNightToShow.map(product => (
                                                <div className="col-xl-3 col-md-4 col-sm-6 center-block" key={product.name}>
                                                    <ul className="nopointul text-center">
                                                    <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{product.name}</strong></li>
                                                        <li><strong>Cantidad diaria: </strong>{product.amountPerDay}</li>
                                                        <li><strong>Cantidad restante: </strong>{product.remainingAmount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editProduct(product._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteProduct(product._id , product.name)}><span className="fas fa-trash"></span></button></li>
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
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