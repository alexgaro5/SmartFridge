//Importamos react, metodos comunes, varaibles globales (dotenv).
import React, { Component } from 'react'
import axios from 'axios'
import {isSomeoneConnected} from '../commonMethods';
require('dotenv').config();

//La página de la actividad de un usuario
export default class Activity extends Component {
    
    //Usamos la variable sl(para guardar la lista de la compra) y el slToShow(Para recoger la información de cada sl y mostrarla).
    state = {
        act: [],
        actMorningToShow: [],
        actAfternoonToShow: [],
        actNightToShow: [],
        dateSelected: ''
    }

    //Envia una peticion para obtener la lista de la compra y añadirla a la variable "sl"
    getActivity = async () => {
        const usr = document.cookie.toString().split("=")[1];

        this.setState({actMorningToShow: []});
        this.setState({actAfternoonToShow: []});
        this.setState({actNightToShow: []});

        if(usr !== undefined){
            const act = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_ACTIVITY + usr);
            this.setState({act: act.data});
            
            this.state.act.map(async product => {

                const date = product.date.split("T")[0];
                const hour = parseInt(product.date.split("T")[1].split(":")[0]) + 2;

                if(date === this.state.dateSelected){
                    if(hour >= 8 && hour < 12){
                        this.setState({actMorningToShow: this.state.actMorningToShow.concat(product)});
                    }else if(hour >= 12 && hour < 20){
                        this.setState({actAfternoonToShow: this.state.actAfternoonToShow.concat(product)});
                    }else{
                        this.setState({actNightToShow: this.state.actNightToShow.concat(product)});
                    }
                }
            })
        }
    }

    getFormattedDate = (input) => {
        const time = input.split("T")[1];

        var hours = parseInt(time.split(":")[0]) + 2;
        var minutes = time.split(":")[1];

        return hours + ':' + minutes;
    }

    getActualDay = () => {
        var now = new Date();
        var month = (now.getMonth() + 1);               
        var day = now.getDate();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        this.setState({dateSelected: (now.getFullYear() + '-' + month + '-' + day)});
    }

    onChange = () => {
        this.setState({dateSelected: document.formdate.date.value});
        this.getActivity();
    }

    //Envia una peticion para eliminar la actividad del usuario que está logueado.
    deleteActivity = async () => {
        const usr = document.cookie.toString().split("=")[1];
        if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_ACTIVITY)) {
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_ACTIVITY + usr + "&true");
            this.getActivity();
        }
    }

    //Cuando el componente esté montado, se llamará al método getActivity() para obtener los datos de los usuarios y mostrarlos
    async componentDidMount(){
        this.getActualDay();
        this.getActivity();
    }

    render() {
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header text-center">
                                <strong className="title" >ACTIVIDAD DEL USUARIO <button className="float-right btn btn-danger btn-sm" onClick={() => this.deleteActivity()}><span className="fas fa-trash-alt"></span></button></strong>
                            </div>
                            <div className="card-body">
                                <div className="col-sm-12 my-auto text-center">
                                    <form name="formdate">
                                        <div className="form-group">
                                            <label htmlFor="name">Introduzca la fecha en la que quiere ver la actividad:</label>
                                            <input className="form-control" id="date" type="date" onChange={this.onChange} defaultValue={this.state.dateSelected} required/>
                                        </div>
                                    </form>
                                </div>
                                <h3 className="text-center col-sm-12">Mañana</h3>
                                <br/>
                                <div className="row">
                                    {
                                        (this.state.actMorningToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay actividad del usuario en la mañana.</em></h5></div> :
                                        this.state.actMorningToShow.map(product => (
                                            <div className="col-xl-2 col-md-4 col-sm-6 center-block" key={product.name}>
                                                <ul className="nopointul text-center">
                                                    <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                    <li><strong>{product.name}</strong></li>
                                                    <li><strong>Hora: </strong>{this.getFormattedDate(product.date)}</li>
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
                                        (this.state.actAfternoonToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay actividad del usuario en la tarde.</em></h5></div> :
                                        this.state.actAfternoonToShow.map(product => (
                                            <div className="col-xl-2 col-md-4 col-sm-6 center-block" key={product.name}>
                                                <ul className="nopointul text-center">
                                                    <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                    <li><strong>{product.name}</strong></li>
                                                    <li><strong>Hora: </strong>{this.getFormattedDate(product.date)}</li>
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
                                        (this.state.actNightToShow.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay actividad del usuario en la noche.</em></h5></div> :
                                        this.state.actNightToShow.map(product => (
                                            <div className="col-xl-2 col-md-4 col-sm-6 center-block" key={product.name}>
                                                <ul className="nopointul text-center">
                                                    <li><img src={product.imageUrl} alt={product.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                    <li><strong>{product.name}</strong></li>
                                                    <li><strong>Hora: </strong>{this.getFormattedDate(product.date)}</li>
                                                </ul>
                                            </div>
                                        ))
                                    }
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