package models

import "time"

type ParkingSlot struct {
	ID                 uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name               string    `gorm:"type:varchar(255)" json:"name"`
	SensorID           string    `gorm:"type:bigint | uniqueIndex" json:"sensor_id"`
	ParkingSlotGroupId int       `gorm:"type:bigint | uniqueIndex" json:"parking_slot_group_id"`
	Distance           float64   `gorm:"type:decimal" json:"distance"`
	Latitude           string    `gorm:"type:varchar(255)" json:"latitude"`
	Longitude          string    `gorm:"type:varchar(255)" json:"longitude"`
	Image              string    `gorm:"type:varchar(255)" json:"image"`
	Free               int       `gorm:"type:int" json:"free"`
	Status             string    `gorm:"type:varchar(50)" json:"status"`
	CreatedAt          time.Time `gorm:"type:timestamp" json:"created_at"`
	UpdatedAt          time.Time `gorm:"type:timestamp" json:"updated_at"`
}

func (ParkingSlot) TableName() string {
	return "parking_slot"
}
