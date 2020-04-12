Universidad de Almería ®
---

# SmartFridge: Reconocimiento de acciones en un frigorífico y toma de decisiones en un ambiente inteligente.

_El objetivo principal de este proyecto es implementar o desarrollar un prototipo de frigorífico inteligente, denominado SmartFridge. Para esto será necesario integrar una serie de dispositivos en el frigorífico (entre ellos algunos sensores), procesar los datos generados e incorporar diferentes acciones o funciones con los datos obtenidos._

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._


### Pre-requisitos 📋

_Para que el sistema funcione correctamente, debemos de tener instalado MongoDB y NodeJS en nuestro equipo_

_Podemos descargar MongoDB haciendo [click aquí](https://www.mongodb.com/download-center/community) y NodeJS haciendo [click aquí](https://nodejs.org/es/download/current/)_

### Ejecución 🔧

_Una vez que cumplimos los pre-requisitos y tenemos el proyecto descargado en forma local, debemos de ejecutar los .bat que hay en la carpeta raiz para crear una comunicación entre los cinco controladores, el back-end y el front-end._

_Los controladores, el back-end y el front-end vienen configurados con unas IPs y unos puertos especificos. Si es necesario cambiarlos, podemos hacerlo en el archivos .env dentro de la carpeta 'Proyecto' y en el .env dentro de la carpeta 'frontend'. También deberemos de cambiarlo en el código de cada Arduino y volver a cargar el código en estos._

_Una vez todo ejecutado, para entrar a la interfaz, debemos que escribir en un navegador la IP y el puerto configurado para el front-end. Si no se ha cambiado, es [192.168.1.225:4000](http://192.168.1.225:4000). De esta manera, tendremos acceso a la interfaz._ 

## Construido con 🛠️

_Para la creación del proyecto se ha utilizado [Stack MERN](https://platzi.com/blog/que-es-mern-stack-javascript/), que está constituido por las siguientes herramientas:_

* [MongoDB](https://www.mongodb.com/es) - Es la base de datos
* [ExpressJS](https://expressjs.com/es/) y [NodeJS](https://nodejs.org/es/) - Se utiliza para administrar el back-end
* [React](https://es.reactjs.org/) - Se utiliza para la creación del front-end

_Adicionamiente, hemos usado otras librerias como [Axios](https://github.com/axios/axios) para enviar peticiones al servidor, o [BootStrap](https://getbootstrap.com/) para usar clases predefinidas de CSS._

## Licencia 📄

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](https://github.com/alexgaro5/SmartFridge/blob/master/LICENSE.md) para detalles

## Autor ✒️

* **Rafael Alejandro García Rodríguez** - *Creador del proyecto*

## Participantes 😊

* **Juana López Redondo** - *Directora del proyecto*
* **Savíns Puertas Martín** - *Codirector del proyecto*
* **Pilar Martínez Ortigosa** - *Proporcionadora de ideas para el proyecto*
* **Juan Francisco Sanjuan Estrada** - *Proporcionador de ideas para el proyecto*

---
_Universidad de Almería ®_