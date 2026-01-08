package main

import (
	"encoding/json"
	"log"
	"os"
	"smartParkingBack/internal/database"
	"smartParkingBack/internal/models"
	"smartParkingBack/internal/mqtt"
	"strconv"
	"time"
)

func main() {
	// --- 1. Load config ---
	portStr := os.Getenv("MQTT_PORT")
	mqttPort, err := strconv.Atoi(portStr)
	if err != nil {
		log.Fatal("invalid MQTT_PORT")
	}

	// --- 2. Connect DB ---
	database.Connect()

	// --- 3. MQTT client ---
	cfg := mqtt.Config{
		Host:     os.Getenv("MQTT_HOST"),
		Port:     mqttPort,
		Username: os.Getenv("MQTT_USERNAME"),
		Password: os.Getenv("MQTT_PASSWORD"),
		UseTLS:   false,
	}

	client, err := mqtt.NewClient(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	topic := os.Getenv("MQTT_TOPIC")

	if err := client.Subscribe(topic, func(msg []byte) {
		var payload models.SensorDataMessage
		if err := json.Unmarshal(msg, &payload); err != nil {
			log.Println("Invalid JSON:", err)
			return
		}

		data := models.SensorData{
			SensorUID: payload.SensorID,
			Distance:  payload.Distance,
			Processed: payload.Processed,
			UpdatedAt: time.Unix(payload.UpdatedAt, 0),
		}

		if err := database.DB.Create(&data).Error; err != nil {
			log.Println("DB error:", err)
		}
	}); err != nil {
		log.Fatal(err)
	}

	log.Println("MQTT consumer started")

	// --- 4. Block forever ---
	select {}
}
