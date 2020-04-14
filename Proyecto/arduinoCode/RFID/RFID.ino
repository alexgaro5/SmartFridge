//Libreria para el RFID
#include <MFRC522.h>
//Libreria para conectarnos al wifi
#include <WiFiNINA.h>
//Libreria para enviar paquetes al backend
#include <WiFiUdp.h>

//Diferentes pines a utilizar
int resetPin = 2;
int ssPin = 3;  
int usingRFIDPin = 4;
int userOrProductRegistred = 5;
int productDeleted = 6;
int userDeleted = 7;
int userLogin = 8;
int error = 9;

//Creamos las variables necesarias.
char ipSend[] = "192.168.1.225";  //Raspberry IP
IPAddress ipReceive(192, 168, 1, 226);  //Arduino IP
int status = WL_IDLE_STATUS;
char ssid[] = "WLAN_COLETO";  //SSID del WiFi
char pass[] = "4eddec6e8465458a4096"; //Contraseña del WiFi
int localPort = 41234;  //Puerto para tener conexión entre el backend y la arduino
MFRC522::MIFARE_Key key;
MFRC522::StatusCode statusAuth;
byte block = 1;
byte len = 18;
char writeBuffer[34]; //Para guardar el mensaje que llega
byte writeBufferRFID[16]; //Para guardar el mensaje que se envia a la tarjeta
int packetSize;
int timeInsideLoop;

WiFiUDP Udp;
MFRC522 rfid(ssPin, resetPin);

void setup() {
  //Preparamos el baud rate y el modo por defecto de los pines
  Serial.begin(9600);
  pinMode(usingRFIDPin , OUTPUT);
  pinMode(userOrProductRegistred , OUTPUT);
  pinMode(productDeleted , OUTPUT);
  pinMode(userDeleted , OUTPUT);
  pinMode(userLogin , OUTPUT);
  pinMode(error , OUTPUT);

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

  //Iniciamos RFID
  rfid.PCD_Init();   
}

void loop() {

  if((millis() - previousMillis) > 10000){
    Udp.beginPacket(ipSend, localPort);
    Udp.write("A");
    Udp.endPacket();
    previousMillis = millis();
  }

  //Creamos las variables 'message' y 'empty' 
  byte message[len];
  byte empty[len];

  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  if(!rfid.PICC_IsNewCardPresent() or !rfid.PICC_ReadCardSerial()){
    return;
  }

  statusAuth = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid));

  if (statusAuth != MFRC522::STATUS_OK) {
    return;
  }

  //En el momento que ha detectado una tarjeta y el estado es OK, leemos el contenido y lo guardamos en 'message'
  rfid.MIFARE_Read(block, message, &len);

  //Si la tarjeta está en blanco.
  if(message[1] == ' '){
    //Mostramos con un LED que está siendo usada la tarjeta y vamos a enviar un mensaje al backend para que nos envie que tenemos que escribir en la tarjeta.
    digitalWrite(usingRFIDPin , HIGH);
    Udp.beginPacket(ipSend, localPort);
    Udp.write("I");
    Udp.endPacket();

    //Esperamos a que nos lluegue la respuesta
    timeInsideLoop = 0;
    do{
      packetSize = Udp.parsePacket();
      delay(1);
      timeInsideLoop++;
    }while(!packetSize && timeInsideLoop <= 999);

    //Si no llega una respuesta, se mostrará con un LED que ha habido un error, puesto que siempre tiene que enviar una respuesta.
    if(timeInsideLoop == 1000){
      digitalWrite(usingRFIDPin , LOW);
      digitalWrite(error , HIGH);
      return;  
    }

    //Leemos la respuesta del backend y la guardamos en writeBuffer
    Udp.read(writeBuffer, 255);

    //Si la respuesta del backend es diferente a 'N' (que sería el caso en el que no hubiera nada para añadir), significa que lo leido (writeBuffer) es para añadir directamente en la tarjeta. 
    if(writeBuffer[0] != 'N'){ 
      //Preparamos para enviar un paquete como confirmación de que se ha añadido en la tarjeta para que el backend haga lo necesario despues de añadir algo a la tarjeta (modo 1).
      Udp.beginPacket(ipSend, localPort);
      Udp.write("1;");

      //Preparamos el mensaje para ser escrito en la tarjeta
      if(writeBuffer[0] == 10){
        for (uint8_t i = 0; i < 16; i++) {
          writeBuffer[i] = writeBuffer[i+1];
        }
      }
  
      for (uint8_t i = 0; i < 16; i++) {
        writeBufferRFID[i] = writeBuffer[i];
        if(writeBuffer[i] == '#'){
          break;
        }
      }

      //Escribimos el mensaje en la tarjeta
      rfid.MIFARE_Write(block, writeBufferRFID, 16);

      //Añadimos en el paquete lo que hemos añadido en la tarjeta
      for (uint8_t i = 0; i < 16; i++) {
        
        Udp.write(writeBuffer[i]);
        if(writeBuffer[i] == '#'){
          break;
        }
      }
      //Enviamos el paquete al backend como confirmación de escritura
      Udp.endPacket();
      //Mostramos por un LED que la escritura ha sido satisfactoria.
      digitalWrite(userOrProductRegistred , HIGH);
      delay(1000);
      digitalWrite(userOrProductRegistred , LOW);
    }

    digitalWrite(usingRFIDPin , LOW);

  }else{
    //Mostramos con un LED que está siendo usada la tarjeta. Si la tarjeta, el primer caracter es una 'P', significa que es un producto, por lo que estamos sacando un producto de la nevera (modo 2)
    digitalWrite(usingRFIDPin , HIGH);
    if(message[0] == 'P'){
      //Preparamos un paquete para enviar al backend anunciando la salida del producto con ID escrita en la tarjeta.
      Udp.beginPacket(ipSend, localPort);
      Udp.write("2;");

      //Escribimos el ID en el paquete a enviar.
      for (uint8_t i = 0; i < 16; i++) {
        if(message[i] != '#'){
          Udp.write(message[i]);
        }else{
          break;
        }
      }

      //Se envia el paquete
      Udp.endPacket();
      
      for (uint8_t i = 0; i < 16; i++) {
        empty[i] = ' ';
      }

      //Se deja la tarjeta en blanco
      rfid.MIFARE_Write(block, empty, 16);   

      //Se muentra con un LED que el proceso de sacar un producto de la nevera ha terminado.
      digitalWrite(productDeleted , HIGH);
      delay(1000);
      digitalWrite(productDeleted , LOW);

    //Si la tarjeta, el primer caracter es una 'U', significa que es un usuario, por lo que estamos iniciando sesion o eliminando un usuario de la tarjeta (modo 3)
    }else if(message[0] == 'U'){
      //Preparamos un paquete para enviar al backend anunciando que un usuario ha pasado la tarjeta, y tenemos que esperar contestación para saber que hacer.
      Udp.beginPacket(ipSend, localPort);
      Udp.write("3;");

      //Leemos el usuario y lo añadimos al paquete.
      for (uint8_t i = 0; i < 16; i++) {
        if(message[i] != '#'){
          Udp.write(message[i]);
        }else{
          break;
        }
      }

      //Enviamos el paquete
      Udp.endPacket();

      //Esperamos respuesta para saber que hacer.
      timeInsideLoop = 0;
      do{
        packetSize = Udp.parsePacket();
        timeInsideLoop++;
      }while(!packetSize || timeInsideLoop <= 999);

      //Si no llega una respuesta, se mostrará con un LED que ha habido un error, puesto que siempre tiene que enviar una respuesta.
      if(timeInsideLoop == 1000){
        digitalWrite(usingRFIDPin , LOW);
        digitalWrite(error , HIGH);
        return;  
      }

      //Escribimos la respuesta que nos ha llegado en 'writeBuffer'
      Udp.read(writeBuffer, 255);

      //Si al respuesta es S, eliminamos el contenido de la tarjeta dejándola en blanco y mostrando con un LED la eliminaci´ón del contenido.
      if(writeBuffer[0] == 'S'){
        for (uint8_t i = 0; i < 16; i++) {
          empty[i] = ' ';
        }
        
        rfid.MIFARE_Write(block, empty, 16);   

        digitalWrite(userDeleted , HIGH);
        delay(1000);
        digitalWrite(userDeleted , LOW);
      }else{
        //Si nos dan otra respuesta, significa que esta iniciando sesión y no tenemos que eliminar nada, por lo que mostramos por un LED el correcto inicio de sesión del usuario.
        digitalWrite(userLogin , HIGH);
        delay(1000);
        digitalWrite(userLogin , LOW);
      }
      
    }else{
      //Si el contenido de la tarjeta no es ninguno de los mencionados, significa que el contenido está defectuoso y se va a limpiar el contenido dejándola en blanco.
      for (uint8_t i = 0; i < 16; i++) {
        empty[i] = ' ';
      }
      
      rfid.MIFARE_Write(block, empty, 16);   
    }
    digitalWrite(usingRFIDPin , LOW);
  }
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
