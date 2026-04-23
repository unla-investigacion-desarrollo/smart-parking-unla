package firebase

import "time"

type ParkingSlotEvent struct {
	ID                 int       `firestore:"id"`
	Name               string    `firestore:"name"`
	SensorID           string    ` firestore:"sensor_id"`
	ParkingSlotGroupId int       ` firestore:"parking_slot_group_id"`
	Distance           float64   ` firestore:"distance"`
	Latitude           string    ` firestore:"latitude"`
	Longitude          string    ` firestore:"longitude"`
	Image              string    ` firestore:"image"`
	Free               int       `firestore:"free"`
	Status             string    `firestore:"status"`
	CreatedAt          time.Time `firestore:"created_at"`
	UpdatedAt          time.Time `firestore:"updated_at"`
}
