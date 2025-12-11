package models

import "time"

type Sensor struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(255)" json:"name"`
	SensorUID string    `gorm:"type:varchar(255)" json:"sensor_uid"`
	Distance  float64   `gorm:"type:decimal" json:"distance"`
	Latitude  string    `gorm:"type:varchar(255)" json:"latitude"`
	Longitude string    `gorm:"type:varchar(255)" json:"longitude"`
	CreatedAt time.Time `gorm:"type:timestamp" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamp" json:"updated_at"`
}

func (Sensor) TableName() string {
	return "sensors"
}
