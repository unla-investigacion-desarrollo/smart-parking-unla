#ifndef CONF_H
#define CONF_H

struct Sensor {
    const char* uid;
    int trigPin;
    int echoPin;
}; 

const Sensor sensors[] = { {"f8nmvNKj", 23, 22}, 
  {"5Na0AQ5s", 26, 13},
};

const int NUM_SENSORS = sizeof(sensors) / sizeof(sensors[0]);

const char *WIFI_SSID = "ClaroMSL";
const char *WIFI_PASSWORD = "12563478";

const char *MQTT_BROKER_HOST = "129.212.182.8";
const int MQTT_BROKER_PORT = 1883;
const char *MQTT_BROKER_TOPIC = "testtopic/sensors";
const char *MQTT_BROKER_USERNAME = "myuser";
const char *MQTT_BROKER_PASSWORD = "mypassword";

const int TIME_DELAY = 30000;

#endif