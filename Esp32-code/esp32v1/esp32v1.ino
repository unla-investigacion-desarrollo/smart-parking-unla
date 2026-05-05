#include <WiFi.h>
#include <PubSubClient.h>
#include <NTPClient.h>
#include <ArduinoJson.h>
#include "env.h"

#define TRIG_PIN 12 // GPIO 12 for TRIG
#define ECHO_PIN 13 // GPIO 13 for ECHO
const char *ssid = WIFI_SSID; 
const char *password = WIFI_PASSWORD; 
// MQTT Broker
const char *mqtt_broker = MQTT_BROKER_HOST;
const char *topic = MQTT_BROKER_TOPIC;
const char *mqtt_username = MQTT_BROKER_USERNAME;
const char *mqtt_password = MQTT_BROKER_PASSWORD;
const int mqtt_port = MQTT_BROKER_PORT;

const char *sensor_id = SENSOR_ID;

const int time_delay = TIME_DELAY;

WiFiClient espClient;
PubSubClient client(espClient);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 86400000); // UTC timezone, update every 24hs en segundos


void setup() {
  Serial.begin(115200); // Start the serial communication at 115200 baud rate
  pinMode(TRIG_PIN, OUTPUT); // Set TRIG pin as OUTPUT
  pinMode(ECHO_PIN, INPUT);  // Set ECHO pin as INPUT
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Conectando al WiFi..");
  }
   Serial.println("Ya me contecté al WiFi");
   timeClient.begin();
    client.setServer(mqtt_broker, mqtt_port);
    while (!client.connected()) {
        String client_id = "esp32-client-32323232";
        client_id += String(WiFi.macAddress());
        Serial.printf("Conectando al MQTT broker\n", client_id.c_str());
        if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("Ya me conecté al MQTT broker");
        } else {
            Serial.print("Conexión con MQTT broker fallida. Estado: ");
            Serial.print(client.state());
            delay(2000);
        }
    }
}

void loop() {
  long duration;
  float distance;
  
  timeClient.update();

  // Trigger the sensor by sending a HIGH pulse for 10 microseconds
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2); // Ensure trigger pin is LOW before sending a pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  // Measure the duration of the echo pulse
  duration = pulseIn(ECHO_PIN, HIGH);

  // Calculate distance in centimeters
  if (duration == 0) {
      distance = -1; 
  } else {
      distance = duration * 0.034 / 2;
      if (distance > 400 || distance < 2) {
          distance = -1;
      }
  }
  /* Print the distance to the serial monitor
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");*/
  //armamos el json
  char jsonBuffer[256];
  StaticJsonDocument<200> data;
  data["distance"] = distance;
  data["updated_at"] = timeClient.getEpochTime();
  data["sensor_id"] = sensor_id;
  data["processed"] = 0;
  serializeJson(data, jsonBuffer);
  //enviamos a MQTT
  client.publish(topic, jsonBuffer);

  delay(time_delay);
}

