#ifndef CONF_H
#define CONF_H

#define TRIG_PIN 4 // GPIO 12 TRIGGER PIN for all the HC-SR04 connected

//CONFIGURACION IDS DE N SENSORES TOMAR EL UID DE BACKOFFICE
//const char *SENSOR_UID = "idSerial_CAXDVDFV";

struct Sensor {
  const char* uid;
  int echoPin;
};
// ejemplo de 4 sensores 
const Sensor sensors[] = {  
  {"xlPmFsd6", 13},
  {"58ajSVcO", 14},
};

const int NUM_SENSORS = sizeof(sensors) / sizeof(sensors[0]);

// CONFIGURACION WIFI
//const char *WIFI_SSID = "motoforsmartparking";
//const char *WIFI_PASSWORD = "sanlorenzo2025";
//const char *WIFI_SSID = "ClaroMSL";
//const char *WIFI_PASSWORD = "12563478";
const char *WIFI_SSID = "moto g60s";
const char *WIFI_PASSWORD = "sanlorenzo2023v2";

//CONFIGURACION MQTT BROKER
const char *MQTT_BROKER_HOST = "129.212.182.8";
const int MQTT_BROKER_PORT = 1883;
const char *MQTT_BROKER_TOPIC = "testtopic/sensors";
const char *MQTT_BROKER_USERNAME = "myuser";
const char *MQTT_BROKER_PASSWORD = "mypassword";
//TIEMPO ENTRE MEDICIONES EN MILISEGUNDOS
const int TIME_DELAY = 30000; //30s


#endif 
