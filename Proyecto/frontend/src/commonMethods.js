/** 
 * Descripción: Devuelve las variables que están en la dirección web.
 * Parámetros de entrada: Nada.
 * Devolución del método: Variables.
*/
export function getUrlVariables(){
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

/** 
 * Descripción: Devuelve true o false para especificar si el admin está conectado.
 * Parámetros de entrada: Nada.
 * Devolución del método: True o false.
*/
export function isAdminConnected() {
    var name = "user=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        var substr = c.substring(name.length, c.length);
        if(substr === '5e6184330e85e2546cfca8ea'){
            return true;
        };
      }
    }
    return false;
}

/** 
 * Descripción: Devuelve true o false para especificar si hay alguien conectado.
 * Parámetros de entrada: Nada.
 * Devolución del método: True o false.
*/
export function isSomeoneConnected() {
    var name = "user=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return true;
      }
    }
    return false;
}