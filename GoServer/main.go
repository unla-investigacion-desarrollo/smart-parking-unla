package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"os/signal"
	"smartParking-back/internal/database"
	"smartParking-back/internal/models"
	"smartParking-back/internal/mqtt"
	"strconv"
	"syscall"
	"time"
)

func main() {

	portStr := os.Getenv("MQTT_PORT")
	mqttPort, errMqtt := strconv.Atoi(portStr)
	if errMqtt != nil {
		panic("invalid MQTT_PORT")
	}

	database.Connect()

	cfg := mqtt.Config{
		Host:     os.Getenv("MQTT_HOST"),
		Port:     mqttPort,
		Username: os.Getenv("MQTT_USERNAME"),
		Password: os.Getenv("MQTT_PASSWORD"),
		UseTLS:   false,
	}

	client, err := mqtt.NewClient(cfg)
	if err != nil {
		panic(err)
	}
	defer client.Close()

	topic := os.Getenv("MQTT_TOPIC")

	if err := client.Subscribe(topic, func(msg []byte) {
		fmt.Println("MQTT Message:", string(msg))

		var payload models.SensorDataMessage
		if err := json.Unmarshal(msg, &payload); err != nil {
			fmt.Println("Invalid JSON:", err)
			return
		}

		data := models.SensorData{
			SensorUID: payload.SensorID, // map from "sensor_id"
			Distance:  payload.Distance,
			Processed: payload.Processed,
			UpdatedAt: time.Unix(payload.UpdatedAt, 0), // epoch → time.Time
		}

		if err := database.DB.Create(&data).Error; err != nil {
			fmt.Println("DB error:", err)
		}
	}); err != nil {
		panic(err)
	}

	// Block until shutdown signal
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig

	// --- 3. Setup Gin Router ---
	router := gin.Default()

	// --- 4. Run Server ---
	port := os.Getenv("PORT")
	if port == "" {
		port = "8090"
	}

	log.Printf("🚀 Starting Gin server on :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
