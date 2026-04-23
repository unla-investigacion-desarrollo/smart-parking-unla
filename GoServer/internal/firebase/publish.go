package firebase

import (
	"context"
	"fmt"
)

func Publish(event ParkingSlotEvent, sensorUID string) error {
	fmt.Println("Firebase publish")
	_, err := Client.
		Collection("sensors_av").
		Doc(sensorUID).
		Set(context.Background(), event)

	return err
}
