package firebase

import "time"

type ParkingSlotEvent struct {
	SensorName           string    `firestore:"sensor_name"`
	ParkingSlotName      string    `firestore:"parking_slot_name"`
	SensorUID            string    `firestore:"sensor_uid"`
	ParkingSlotGroupName string    `firestore:"parking_slot_group_name"`
	Distance             float64   `firestore:"distance"`
	Latitude             string    `firestore:"latitude"`
	Longitude            string    `firestore:"longitude"`
	Image                string    `firestore:"image"`
	Free                 int       `firestore:"free"`
	Status               string    `firestore:"status"`
	CreatedAt            time.Time `firestore:"created_at"`
	UpdatedAt            time.Time `firestore:"updated_at"`
}
