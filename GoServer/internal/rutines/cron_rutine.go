package rutines

import (
	"context"
	"fmt"
	"log"
	"smartParkingBack/internal/database"
	"smartParkingBack/internal/firebase"
	"smartParkingBack/internal/models"
	"sync"
	"time"
)

func StartCron(ctx context.Context) {
	log.Println("cron init")
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			runJob(ctx)
		case <-ctx.Done():
			log.Println("cron stopped")
			return
		}
	}
}

func runJob(ctx context.Context) {
	log.Println("runJob")
	var sensors []models.Sensor
	err := database.DB.Where("deleted_at IS NULL").Find(&sensors).Error
	if err != nil {
		log.Println("cron: failed to load sensors:", err)
		return
	}

	if len(sensors) == 0 {
		log.Println("cron: no sensors found")
		return
	}
	var wg sync.WaitGroup
	sem := make(chan struct{}, 20)

	for _, sensor := range sensors {
		wg.Add(1)
		sem <- struct{}{}
		go func() {
			defer wg.Done()
			defer func() { <-sem }()
			var rows []models.SensorData
			err := database.DB.
				Where("processed = ?", 0).
				Where("sensor_uid = ?", sensor.SensorUID).
				Order("id DESC").
				Limit(10).
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
				processParkingSlot(ctx, sensor, averageDistance)
			}
		}()
		wg.Wait() // block until every goroutine for this tick has finished
		log.Println("tick finished, all sensors processed")
	}

}

func processParkingSlot(ctx context.Context, sensor models.Sensor, averageDistance float64) {
	fmt.Println("processParkingSlot")
	free := 1
	status := "libre"

	if sensor.IsMaximum > 0 {
		if averageDistance > 0 && averageDistance <= sensor.Distance {
			free = 0
			status = "ocupado"
		}
	} else {
		if averageDistance > 0 && sensor.Distance >= averageDistance {
			free = 0
			status = "ocupado"
		}
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
		Joins("ParkingSlotGroup").
		Joins("Sensor").
		Where("sensor_id = ?", sensor.ID).
		First(&fullParkinSlot).
		Error
	event := firebase.ParkingSlotEvent{
		ParkingSlotName:      fullParkinSlot.Name,
		SensorName:           fullParkinSlot.Sensor.Name,
		SensorUID:            fullParkinSlot.Sensor.SensorUID,
		ParkingSlotGroupName: fullParkinSlot.ParkingSlotGroup.Name,
		Distance:             averageDistance,
		Latitude:             fullParkinSlot.Latitude,
		Longitude:            fullParkinSlot.Longitude,
		Image:                fullParkinSlot.Image,
		Free:                 free,
		Status:               status,
		CreatedAt:            fullParkinSlot.CreatedAt,
		UpdatedAt:            time.Now(),
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
