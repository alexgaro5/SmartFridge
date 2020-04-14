//Libreria para el sensor del peso
#include <HX711.h>
//Libreria para conectarnos al wifi
#include <WiFiNINA.h>
//Libreria para enviar paquetes al backend
#include <WiFiUdp.h>

//Diferentes pines a utilizar
const int relojPesoPin1 = 0; 
const int datosPesoPin1 = 1;
const int relojPesoPin2 = 2;
const int datosPesoPin2 = 3;
const int relojPesoPin3 = 4; 
const int datosPesoPin3 = 5;
const int relojPesoPin4 = 6;
const int datosPesoPin4 = 7;
const int relojPesoPin5 = 8; 
const int datosPesoPin5 = 9;
const int relojPesoPin6 = 10;
const int datosPesoPin6 = 11;

char ipSend[] = "192.168.1.225"; //Raspberry IP
IPAddress ipReceive(192, 168, 1, 229); //Arduino IP

int status = WL_IDLE_STATUS;
char ssid[] = "WLAN_COLETO";  //Diferentes pines a utilizar
char pass[] = "4eddec6e8465458a4096"; //Contraseña del WiFi
int localPort = 41237;  //Puerto para tener conexión entre el backend y la arduino

//Las variables para el paquete para enviar, los pesos a usar con su factor de calibración y el nivel
WiFiUDP Udp;
HX711 peso1, peso2, peso3, peso4, peso5, peso6;
float pesoKg1, anteriorPesoKg1, pesoKg2, anteriorPesoKg2, pesoKg3, anteriorPesoKg3, pesoKg4, anteriorPesoKg4, pesoKg5, anteriorPesoKg5, pesoKg6, anteriorPesoKg6;
float factorDeCalibracion1 = -24000;
float factorDeCalibracion2 = -24000;
float factorDeCalibracion3 = -24000;
float factorDeCalibracion4 = -24000;
float factorDeCalibracion5 = -24000;
float factorDeCalibracion6 = -24000;

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
  peso3.begin(datosPesoPin3, relojPesoPin3);
  peso4.begin(datosPesoPin4, relojPesoPin4);
  peso5.begin(datosPesoPin5, relojPesoPin5);
  peso6.begin(datosPesoPin6, relojPesoPin6);
  
  peso1.set_scale();
  peso1.tare();
  peso1.set_scale(factorDeCalibracion1);  

  peso2.set_scale();
  peso2.tare();
  peso2.set_scale(factorDeCalibracion2);  

  peso3.set_scale();
  peso3.tare();
  peso3.set_scale(factorDeCalibracion3);

  peso4.set_scale();
  peso4.tare();
  peso4.set_scale(factorDeCalibracion4);

  peso5.set_scale();
  peso5.tare();
  peso5.set_scale(factorDeCalibracion5);

  peso6.set_scale();
  peso6.tare();
  peso6.set_scale(factorDeCalibracion6);
  
  anteriorPesoKg1 = 0;
  anteriorPesoKg2 = 0;
  anteriorPesoKg3 = 0;
  anteriorPesoKg4 = 0;
  anteriorPesoKg5 = 0;
  anteriorPesoKg6 = 0;
}

void loop() {

  if((millis() - previousMillis) > 10000){
    Udp.beginPacket(ipSend, localPort);
    Udp.write("A");
    Udp.endPacket();
    previousMillis = millis();
  }
  
  //Obtenemos el peso en los diferentes sensores que tenemos.
  pesoKg1 = peso1.get_units();
  pesoKg2 = peso2.get_units();
  pesoKg3 = peso3.get_units();
  pesoKg4 = peso4.get_units();
  pesoKg5 = peso5.get_units();
  pesoKg6 = peso6.get_units();

  //Si el peso son diferentes a los de la ultima ejecución, enviamos un paquete con el peso actualizado para guardarlo en el backend.
  //Para enviar un paquete actualizando el peso de uno de los sensores, tiene que haber una diferencia de peso de 30g entre el peso anterior y el actual.  
  if((anteriorPesoKg1 + 0.03 < pesoKg1) || (anteriorPesoKg1 - 0.03 > pesoKg1 )){
    anteriorPesoKg1 = pesoKg1;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("P1:");
    Udp.write(String(pesoKg1).c_str());
    Udp.endPacket();
  }
  
  if((anteriorPesoKg2 + 0.03 < pesoKg2) || (anteriorPesoKg2 - 0.03 > pesoKg2 )){
    anteriorPesoKg2 = pesoKg2;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("P1:");
    Udp.write(String(pesoKg2).c_str());
    Udp.endPacket();
  }

  if((anteriorPesoKg3 + 0.03 < pesoKg3) || (anteriorPesoKg3 - 0.03 > pesoKg3 )){
    anteriorPesoKg3 = pesoKg3;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("P2:");
    Udp.write(String(pesoKg3).c_str());
    Udp.endPacket();
  }
  
  if((anteriorPesoKg4 + 0.03 < pesoKg4) || (anteriorPesoKg4 - 0.03 > pesoKg4 )){
    anteriorPesoKg4 = pesoKg4;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("P2:");
    Udp.write(String(pesoKg4).c_str());
    Udp.endPacket();
  }

  if((anteriorPesoKg5 + 0.03 < pesoKg5) || (anteriorPesoKg5 - 0.03 > pesoKg5 )){
    anteriorPesoKg5 = pesoKg5;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("P3:");
    Udp.write(String(pesoKg5).c_str());
    Udp.endPacket();
  }
  
  if((anteriorPesoKg6 + 0.03 < pesoKg6) || (anteriorPesoKg6 - 0.03 > pesoKg6 )){
    anteriorPesoKg6 = pesoKg6;
    Udp.beginPacket(ipSend, localPort);
    Udp.write("P3:");
    Udp.write(String(pesoKg6).c_str());
    Udp.endPacket();
  }
}

