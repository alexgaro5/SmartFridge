import React, { Component } from 'react';
import axios from 'axios';
import {getUrlVariables, isAdminConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all');

//La página de las variables
export default class Variable extends Component {
    
    //Vamos a teneruna varaible varaible, para guardar todos los valores actuales para mostrarlos.
    //Ademas, tenemos la variable message por si hay que mostrar alguno y vars para obtener las varaibles de la dirección web
    state = {
        variable: []
    }
    message = '';
    vars = getUrlVariables();

    //Envia la petición para obtener todos los datos de las variables.
    getVaraible = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_VARIABLE);
        this.setState({variable: res.data});
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
            if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_VARIABLE_MODIFIED}</div>;
            return this.message;
        }
        return null;
    }

    //Cuando el componente esté montado, se llamará al método getVaraible() para obtener los datos y mostrarlos.
    async componentDidMount(){
        this.getVaraible();
    }

    //Es un método que sirve para cambiar el valor del input de la variable con ayuda de botones.
    modifyAmount(amount, name, limit) {
        const valor = parseInt(document.form[name].value);
        amount = parseInt(amount);

        if(valor === 0 && amount === limit){
            window.alert("No se pueden introducir números negativos");
        }else{
            document.form[name].value = parseInt(valor)+parseInt(amount);
        }
    }

    render() {
        //Si el usuario admin esta logueado se mostrará la página, si no, no.
        if(isAdminConnected()){
            return (
                <div className="contanier">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4><span className="fas fa-cogs"></span> Modificar varaibles</h4>
                        </div>
                        <div className="card-body">
                            
                            { this.Anuncio() }

                            <form name="form" action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_VARIABLE} method="post">
                                <div className="row">
                                    <div className="col-md-6">

                                        <label htmlFor="1">Cantidad de productos para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-1, "minproduct", -1)}></input> 
                                            <input style={{marginRight: 10}}  type="number" name="minproduct" className="form-control col-sm-2" defaultValue={this.state.variable.minProductUnit} min='0' max='100' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+1, "minproduct", -1)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="2">Cantidad de huevos para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-1, "minegg", -1)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="minegg" className="form-control col-sm-2" defaultValue={this.state.variable.minEggUnit} min='0' max='100' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+1, "minegg", -1)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="3">Cantidad de refrescos para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-1, "minrefreshment", -1)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="minrefreshment" className="form-control col-sm-2" defaultValue={this.state.variable.minRefreshmentUnit} min='0' max='100' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+1, "minrefreshment", -1)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="4">Cantidad de bricks de leche para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-1, "minmilk", -1)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="minmilk" className="form-control col-sm-2" defaultValue={this.state.variable.minMilkUnit} min='0' max='100' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+1, "minmilk", -1)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="5">Cantidad de peso mínimo en gramos de verdura para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-100, "minvegetable", -100)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="minvegetable" className="form-control col-sm-2" defaultValue={this.state.variable.minVegetableWeight} min='0' max='3000' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+100, "minvegetable", -100)}></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="6">Cantidad de peso mínimo en gramos de fruta para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-100, "minfruit", -100)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="minfruit" className="form-control col-sm-2" defaultValue={this.state.variable.minFruitWeight} min='0' max='3000' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+100, "minfruit", -100)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="7">Cantidad de peso mínimo en gramos de embutido para enviar advertencia</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-100, "minsausage", -100)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="minsausage" className="form-control col-sm-2" defaultValue={this.state.variable.minSausageWeight} min='0' max='3000' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+100, "minsausage", -100)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="8">Peso en gramos por brick de leche</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-10, "milkperunit", -10)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="milkperunit" className="form-control col-sm-2" defaultValue={this.state.variable.weightPerMilk} min='0' max='3000' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+10, "milkperunit", -10)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="9">Peso en gramos por refresco</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-10, "refreshmentperunit", -10)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="refreshmentperunit" className="form-control col-sm-2" defaultValue={this.state.variable.weightPerRefreshment} min='0' max='3000' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+10, "refreshmentperunit", -10)}></input>
                                        </div>
                                        <br/>
                                        <label htmlFor="10">Peso en gramos por huevo</label>
                                        <div className="row ">
                                            <input style={{marginLeft: 15, marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount(-10, "eggperunit", -10)}></input> 
                                            <input style={{marginRight: 10}} type="number" name="eggperunit" className="form-control col-sm-2" defaultValue={this.state.variable.weightPerEgg} min='0' max='3000' required/>
                                            <input style={{marginRight: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount(+10, "eggperunit", -10)}></input>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className='text-center'>
                                    <input type="submit" value="Modificar" className="btn btn-primary btn-lg" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }else{
            return window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND
        }
    }
}
