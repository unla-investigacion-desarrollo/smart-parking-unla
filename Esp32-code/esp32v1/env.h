#ifndef CONF_H
#define CONF_H

//CONFIGURACION ID SENSOR TIPO SERIAL FROM BACKOFFICE
const char *SENSOR_UID = "idSerial_CAXDVDFV";
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
const int TIME_DELAY = 5000;


#endif 
