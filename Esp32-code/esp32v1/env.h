#ifndef CONF_H
#define CONF_H

#define TRIG_PIN 12 // GPIO 12 TRIGGER PIN for all the HC-SR04 connected

//CONFIGURACION IDS DE N SENSORES TOMAR EL UID DE BACKOFFICE
//const char *SENSOR_UID = "idSerial_CAXDVDFV";

struct Sensor {
  const char* uid;
  int echoPin;
};
// ejemplo de 4 sensores 
const Sensor sensors[] = {
  {"idSerial_CAXDVDFV", 13},
  {"sensor_2", 14},
  {"sensor_3", 15},
  {"sensor_4", 16}
};

const int NUM_SENSORS = sizeof(sensors) / sizeof(sensors[0]);

// CONFIGURACION WIFI
const char *WIFI_SSID = "wifiSSID";
const char *WIFI_PASSWORD = "wifiPassword";

//CONFIGURACION MQTT BROKER
const char *MQTT_BROKER_HOST = "127.0.0.0";
const int MQTT_BROKER_PORT = 1883;
const char *MQTT_BROKER_TOPIC = "testtopic/sensors";
const char *MQTT_BROKER_USERNAME = "myuser";
const char *MQTT_BROKER_PASSWORD = "mypassword";
//TIEMPO ENTRE MEDICIONES EN MILISEGUNDOS
const int TIME_DELAY = 30000; //30s


#endif 
