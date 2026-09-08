package models

import "time"

type ParkingSlotGroup struct {
	ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"type:varchar(255)" json:"parking_slot_group_name"`
}
type ParkingSlot struct {
	ID                 uint             `gorm:"primaryKey;autoIncrement" json:"id"`
	Name               string           `gorm:"type:varchar(255)" json:"name"`
	SensorId           uint             `gorm:"type:bigint" json:"sensor_id"`
	Sensor             Sensor           `gorm:"foreignKey:SensorId;references:ID" json:"sensor,omitempty"`
	ParkingSlotGroupId uint             `gorm:"type:bigint" json:"parking_slot_group_id"`
	ParkingSlotGroup   ParkingSlotGroup `gorm:"foreignKey:ParkingSlotGroupId;references:ID" json:"parking_slot_group,omitempty"`
	Distance           float64          `gorm:"type:decimal" json:"distance"`
	Latitude           string           `gorm:"type:varchar(255)" json:"latitude"`
	Longitude          string           `gorm:"type:varchar(255)" json:"longitude"`
	Image              string           `gorm:"type:varchar(255)" json:"image"`
	Free               int              `gorm:"type:int" json:"free"`
	Status             string           `gorm:"type:varchar(50)" json:"status"`
	CreatedAt          time.Time        `gorm:"type:timestamp" json:"created_at"`
	UpdatedAt          time.Time        `gorm:"type:timestamp" json:"updated_at"`
}

func (ParkingSlot) TableName() string {
	return "parking_slot"
}
func (ParkingSlotGroup) TableName() string {
	return "parking_slot_group"
}
