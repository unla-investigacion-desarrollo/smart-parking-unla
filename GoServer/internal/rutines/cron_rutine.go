package rutines

import (
	"context"
	"fmt"
	"log"
	"smartParkingBack/internal/database"
	"smartParkingBack/internal/firebase"
	"smartParkingBack/internal/models"
	"time"
)

func StartCron(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			runJob()
		case <-ctx.Done():
			log.Println("cron stopped")
			return
		}
	}
}

func runJob() {
	log.Println("runJob")
	var sensors []models.Sensor
	err := database.DB.Find(&sensors).Error
	if err != nil {
		log.Println("cron: failed to load sensors:", err)
		return
	}

	if len(sensors) == 0 {
		log.Println("cron: no sensors found")
		return
	}
	for _, sensor := range sensors {
		var rows []models.SensorData
		err := database.DB.
			Where("processed = ?", 0).
			Where("sensor_uid = ?", sensor.SensorUID).
			Order("id DESC").
			Limit(10). //TODO QUITAR PARA PROD
			Find(&rows).
			Error

		if err != nil {
			log.Println("cron: query error:", err)
			return
		}
		if len(rows) > 0 {
			// guardo todos los ids y despues hago un solo update
			ids := make([]uint, 0, len(rows))
			var averageDistance float64
			var totalDistance float64 = 0.0
			for _, row := range rows {
				totalDistance += row.Distance
				ids = append(ids, row.ID)
			}
			averageDistance = totalDistance / float64(len(rows))
			err := database.DB.
				Model(&models.SensorData{}).
				Where("id IN ?", ids).
				Update("processed", 1).
				Error

			if err != nil {
				log.Println("cron: bulk update failed:", err)
			}

			//comparamos la distancia promedio con la establecida en el sensor
			//y hacemos el update en el ParkingSlot
			processParkingSlot(sensor, averageDistance)
		}
	}

}

func processParkingSlot(sensor models.Sensor, averageDistance float64) {
	fmt.Println("processParkingSlot")
	free := 1
	status := "libre"
	if averageDistance > 0 && sensor.Distance > averageDistance {
		free = 0
		status = "ocupado"
	}
	err := database.DB.
		Model(&models.ParkingSlot{}).
		Where("sensor_id = ?", sensor.ID).
		Updates(map[string]interface{}{
			"free":       free,
			"status":     status,
			"distance":   averageDistance,
			"updated_at": time.Now(),
		}).
		Error

	if err != nil {
		log.Println("cron: bulk update failed:", err)
	}
	var fullParkinSlot models.ParkingSlot
	err = database.DB.
		Where("sensor_id = ?", sensor.ID).
		First(&fullParkinSlot).
		Error
	event := firebase.ParkingSlotEvent{ID: int(fullParkinSlot.ID),
		Name:               fullParkinSlot.Name,
		SensorID:           fullParkinSlot.SensorID,
		ParkingSlotGroupId: fullParkinSlot.ParkingSlotGroupId,
		Distance:           averageDistance,
		Latitude:           fullParkinSlot.Latitude,
		Longitude:          fullParkinSlot.Longitude,
		Image:              fullParkinSlot.Image,
		Free:               free,
		Status:             status,
		CreatedAt:          fullParkinSlot.CreatedAt,
		UpdatedAt:          time.Now(),
	}
	sendToFirebase(event, sensor.SensorUID)
}

func sendToFirebase(event firebase.ParkingSlotEvent, sensorUid string) {
	go func() {
		if err := firebase.Publish(event, sensorUid); err != nil {
			log.Println("firebase publish failed:", err)
		}
	}()
}
