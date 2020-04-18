//Importa react, bootstrap, index.css y metodos comunes.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {isSomeoneConnected} from './commonMethods';

//Importamos los diferentes archivos con las diferentes páginas.
import Navigation from './components/Navigation';
import User from './components/User';
import Forget from './components/Forget';
import Recover from './components/Recover';
import EditUser from './components/EditUser';
import Products from './components/Products';
import EditProduct from './components/EditProduct';
import Labels from './components/Labels';
import EditLabel from './components/EditLabel';
import Login from './components/Login';
import Database from './components/Database';
import Variable from './components/Variable';
import ShoppingList from './components/ShoppingList';
import Activity from './components/Activity';
import Diet from './components/Diet';


const someone = isSomeoneConnected();
var messageMainLogin = '';

//Comprobamos si hay alguien conectado. Si lo hay, guardamos como página de bienvenida la página "Main", si no lo hay, la  página de "Login"
if(someone){
  messageMainLogin = <Route path="/" exact component={Products}/>
}else{
  messageMainLogin = <Route path="/" exact component={Login}/>
}

//Vamos a crear una ruta para todas las páginas existentes.
function App() {
  return (
    <Router>
      <Route path="/" component={Navigation}/>
      <div className="container p-4">
        {messageMainLogin}
        <Route path="/product" exact component={Products}/> 
        <Route path="/editproduct" exact component={EditProduct}/>
        <Route path="/label" exact component={Labels}/> 
        <Route path="/editlabel" exact component={EditLabel}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/forget" exact component={Forget}/>
        <Route path="/recover" exact component={Recover}/>
        <Route path="/user" exact component={User}/>
        <Route path="/edituser" exact component={EditUser}/>
        <Route path="/database" exact component={Database}/>
        <Route path="/variable" exact component={Variable}/>
        <Route path="/shoppinglist" exact component={ShoppingList}/>
        <Route path="/activity" exact component={Activity}/>
        <Route path="/diet" exact component={Diet}/>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));