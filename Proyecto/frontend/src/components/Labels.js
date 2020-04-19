//Importamos react, metodos comunes, varaibles globales (dotenv) y fortawesome para usar iconos.
import React, { Component } from 'react'
import axios from 'axios'
import {getUrlVariables, isSomeoneConnected} from '../commonMethods';
require('dotenv').config();
require('@fortawesome/fontawesome-free/js/all')

//La página de etiquetas
export default class Labels extends Component {
    
    //Creamos las variables productSelected (para guardar producto seleccionado), labels (para guardar las equitetas existentes), productsWithLabel (para guardar los productos con etiquetas y luego mostrarlas)
    //products (para guardar los productos y listarlos en el formulario) message (por si hay que mostrar alguno) y vars (para recoger las variables de la dirección web).
    state = {
        productSelected: '',
        labels: [],
        products: [],
        productsWithLabel: []
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
        const labels = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LABEL);
        this.setState({labels: labels.data});

        this.state.labels.forEach(async (label) => {
            const product = await axios.get(process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_PRODUCT + label.idProduct);

            if(product.data != null){
                product.data._id = label._id;
                product.data.amount = label.amount;

                if(this.state.productsWithLabel.filter(pr => pr.id === product.data.id).length === 0){
                    this.setState({productsWithLabel: this.state.productsWithLabel.concat(product.data)});
                }

                if(this.state.productsWithLabel.filter(pr => (pr.id === product.data.id && pr.amount !== product.data.amount)).length !== 0){
                    this.state.productsWithLabel.splice(0, 1, product.data);
                }
            }
        });

        this.state.productsWithLabel.forEach(async (productwithlabel) => {
            if(this.state.labels.filter(lb => lb.idProduct === productwithlabel.id).length === 0){
                this.state.productsWithLabel.splice(this.state.productsWithLabel.indexOf(productwithlabel));
            } 
        });
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
            this.setState({productsWithLabel: []});
            this.getLabels();
        }
    }

    //Es un método que sirve para cambiar el valor del input de la variable con ayuda de botones.
    modifyAmount(form, variable, amount) {
        const valor = parseInt(document.getElementById(form).elements.namedItem(variable).value);
        amount = parseInt(amount);

        if(valor !== 0 || amount !== -1){
            document.getElementById(form).elements.namedItem(variable).value = parseInt(valor)+parseInt(amount);
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
                <div id="accordion">
                    <div className="row">
                        <div className="col-md-12">

                             { this.Anuncio() }

                            <div className="card">
                                <button className="btn" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <h4 id="headingOne" className="mb-0">
                                        <span className="fas fa-plus-square"></span> Añadir nueva etiqueta
                                    </h4>
                                    <span className="fas fa-chevron-circle-down"></span>
                                </button>

                                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                    
                                    <div className="card-body">

                                        <form action={process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_BACKEND + process.env.REACT_APP_LABEL} method="post" id="formcreate">
                                        
                                            <div className="form-group">
                                                <label htmlFor="name">Nombre del producto:</label>
                                                <select className="form-control" name="id" onChange={this.onChange} value={this.state.nameSelected}>
                                                    {
                                                        this.state.products.map(product => 
                                                        <option key={product._id} value={product.id}> 
                                                            {product.name}
                                                        </option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="amount">Cantidad:</label>
                                                <input type="number" name="amount" defaultValue='1' min='0' max='100' className="form-control" required/>
                                                <div className="text-center">
                                                    <input style={{marginTop: 10, marginRight: 40}} type="button" className="btn btn-xs btn-primary" value="-" onClick={() => this.modifyAmount("formcreate","amount",-1)}></input> 
                                                    <input style={{marginTop: 10}} type="button" className="btn btn-xs btn-primary" value="+" onClick={() => this.modifyAmount("formcreate","amount",+1)}></input>
                                                </div>
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
                                    <h2>Etiquetas</h2>
                                    <br/>
                                    <div className="row">
                                        {
                                            (this.state.productsWithLabel.length === 0) ? <div className="text-center col-sm-12"><h5><em>No hay etiquetas registradas.</em></h5></div> :
                                            this.state.productsWithLabel.map(label => (
                                                <div className="col-xl-2 col-md-4 col-sm-6 center-block" key={label.id}>
                                                    <ul className="nopointul text-center">
                                                        <li><img src={label.imageUrl} alt={label.name + ".png"} height="100px" className="maxwidth"></img></li>
                                                        <li><strong>{label.name}</strong></li>
                                                        <li>Cantidad: {label.amount}</li>
                                                        <li><button style={{marginRight: 10}} className="btn btn-primary btn-sm" onClick={() => this.editLabel(label._id)}><span className="fas fa-edit"></span></button><button className="btn btn-danger btn-sm" onClick={() => this.deleteLabel(label._id , label.name)}><span className="fas fa-trash"></span></button></li>
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
            return window.location.href= process.env.REACT_APP_IP_RASPBERRY + process.env.REACT_APP_PORT_FRONTEND;
        }
    }
}