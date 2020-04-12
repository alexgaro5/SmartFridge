//Libreria para el sensor del peso
#include <HX711.h>
//Libreria para conectarnos al wifi
#include <WiFiNINA.h>
//Libreria para enviar paquetes al backend
#include <WiFiUdp.h>

//Diferentes pines a utilizar
const int relojPesoPin1 = 2; 
const int datosPesoPin1 = 3;
const int relojPesoPin2 = 4;
const int datosPesoPin2 = 5;

char ipSend[] = "192.168.1.225"; //Raspberry IP
IPAddress ipReceive(192, 168, 1, 230); //Arduino IP

int status = WL_IDLE_STATUS;
char ssid[] = "WLAN_COLETO";  //Diferentes pines a utilizar
char pass[] = "4eddec6e8465458a4096"; //Contraseña del WiFi
int localPort = 41238;  //Puerto para tener conexión entre el backend y la arduino

//Las variables para el paquete para enviar, los pesos a usar con su factor de calibración y el nivel
WiFiUDP Udp;
HX711 peso1, peso2;
float pesoKg1, anteriorPesoKg1, pesoKg2, anteriorPesoKg2;
float factorDeCalibracion1 = -24000;
float factorDeCalibracion2 = -24000;

void setup() {
  
  //Establecemos el baudrate.
  Serial.begin(9600);

  //Comienzo de conexión con el WiFi
  while (!Serial) {
    ;
  }

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Fallo de comunicación con el módulo del WiFi!");
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Por favor, actualiza el firmware");
  }

  Serial.print("Intentando conectar con el WiFi con SSID: ");
  Serial.println(ssid);

  while (status != WL_CONNECTED) {
    status = WiFi.begin(ssid, pass);
  }
  WiFi.config(ipReceive);
  Serial.println("Conectado al wifi");
  Serial.print("Dirección IP: ");
  Serial.println(ipReceive);

  Udp.begin(localPort);
  //Conexión con el wifi terminada

  //Inicializamos los pesos a usar
  peso1.begin(datosPesoPin1, relojPesoPin1);
  peso2.begin(datosPesoPin2, relojPesoPin2);
  
  peso1.set_scale();
  peso1.tare();
  peso1.set_scale(factorDeCalibracion1);  

  peso2.set_scale();
  peso2.tare();
  peso2.set_scale(factorDeCalibracion2);  
  
  anteriorPesoKg1 = 0;
  anteriorPesoKg2 = 0;
}

void loop() {
  //Obtenemos el peso en los diferentes sensores que tenemos.
  pesoKg1 = peso1.get_units();
  pesoKg2 = peso2.get_units();

  //Si el peso son diferentes a los de la ultima ejecución, enviamos un paquete con el peso actualizado para guardarlo en el backend.
  //Para enviar un paquete actualizando el peso de uno de los sensores, tiene que haber una diferencia de peso de 30g entre el peso anterior y el actual.
  if((anteriorPesoKg1 + 0.03 < pesoKg1) || (anteriorPesoKg1 - 0.03 > pesoKg1 )){
    anteriorPesoKg1 = pesoKg1;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("PI:");
    Udp.write(String(pesoKg1).c_str());
    Udp.endPacket();
  }
  
  if((anteriorPesoKg2 + 0.03 < pesoKg2) || (anteriorPesoKg2 - 0.03 > pesoKg2 )){
    anteriorPesoKg2 = pesoKg2;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("PD:");
    Udp.write(String(pesoKg2).c_str());
    Udp.endPacket();
  }
}

