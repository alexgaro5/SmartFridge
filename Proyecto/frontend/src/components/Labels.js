//Importamos react, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import axios from 'axios'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de etiquetas
export default class Labels extends Component {
    
    //Creamos las variables productSelected (para guardar producto seleccionado), labels (para guardar las equitetas existentes para mostrarlas), 
    //products (para guardar los productos y listarlos en el formulario) message (por si hay que mostrar alguno) y vars (para recoger las variables de la dirección web).
    state = {
        productSelected: '',
        labels: [],
        products: []
    }

    message = '';
    delete = ''
    vars = getUrlVariables();

    //Va actualizando la variable "productSelected" cada vez que cambiamos el producto del formulario.
    onChange= (e) => {
        this.setState({productSelected: e.target.value});
    }

    //Obtiene todas las etiquetas existentes para mostrarlas.
    getLabels = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LABEL);
        this.setState({labels: res.data});
    }

    //Obtiene todas las etiquetas existentes para ponerlas como opcion de selección en el formulario.
    getProducts = async () => {
        const res = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT);
        this.setState({products: res.data});
    }

    //Reenvia a la pagina de editar etiqueta con la ID de la etiqueta.
    editLabel = async (id) => {
        window.location.href = process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND + process.env.REACT_APP_EDITLABEL + id;
    }

    //Envia la petición de eliminado de etiqueta con la ID de esta.
    deleteLabel = async (id, name) => {
        if (window.confirm(process.env.REACT_APP_CONFIRM_DELETE_LABEL + "'" + name + "'?")) {
            await axios.delete(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LABEL + id);
            this.getLabels();
        }
    }

    //Si hay algún mensaje que mostrar (si viene alguno en la dirección web), se devolverá este mensaje para mostrarlo.
    Anuncio(){  
        if(this.vars['msg'] != null){
        if(this.vars['msg'] === 'samelabel') this.message = <div className="alert alert-danger text-center">{process.env.REACT_APP_LABEL_REPEAT}</div>;
        if(this.vars['msg'] === 'success') this.message = <div className="alert alert-success text-center">{process.env.REACT_APP_LABEL_ADDED}</div>;
            return this.message;
        }
        return null;
    }    

    //Cuando el componente esté montado, se llamará al método getLabels() y getProducts() para obtener los datos de la etiqueta y productos y mostrarlos
    //Ademas, se va a estar actualizando las etiquetas a mostrar cada segundo.
    async componentDidMount(){
        this.getProducts();
        this.getLabels();
        setInterval(() => this.getLabels(), 1000);
    }

    render() {
        //Si hay alguien logueado se mostrará la página, si no, no.
        if(isSomeoneConnected()){
            return (
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header text-center">
                                <h4><span className="fas fa-plus-square"></span> Añadir nueva etiqueta</h4>
                            </div>
                            <div className="card-body">
                                
                                { this.Anuncio() }

                                <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LABEL} method="post">
                                   
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre del producto:</label>
                                        <select className="form-control" name="nameProduct" onChange={this.onChange} value={this.state.nameSelected}>
                                            {
                                                this.state.products.map(product => 
                                                <option key={product._id} value={product.name}> 
                                                    {product.name}
                                                </option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Cantidad:</label>
                                        <input type="number" name="amount" defaultValue='1' min='0' max='100' className="form-control" required/>
                                    </div>
                                    <div className='text-center'>
                                        <input type="submit" value="Añadir" className="btn btn-primary btn-lg" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h2>Etiquetas existentes:</h2>
                        <ul className="list-group">
                            {
                                this.state.labels.map(label => (
                                    <li className="list-group-item" key={label._id}>
                                        <span className="my-auto" style={{marginRight: 10}}><strong>Nombre:</strong> {label.nameProduct} </span>
                                        <span className="my-auto"><strong>Cantidad:</strong> {label.amount}</span>
                                        <button className="float-right btn btn-danger btn-sm" onClick={() => this.deleteLabel(label._id, label.nameProduct)}><span className="fas fa-trash"></span></button>
                                        <button className="float-right btn btn-primary btn-sm" style={{marginRight: 10}} onClick={() => this.editLabel(label._id)}><span className="fas fa-edit"></span></button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            )
        }else{
            return window.location.href= process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND;
        }
    }
}