package models

import "time"

type Sensor struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(255)" json:"sensor_name"`
	SensorUID string    `gorm:"type:varchar(255) | uniqueIndex" json:"sensor_uid"`
	Distance  float64   `gorm:"type:decimal" json:"distance"`
	CreatedAt time.Time `gorm:"type:timestamp" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamp" json:"updated_at"`
	DeletedAt time.Time `gorm:"type:timestamp" json:"deleted_at"`
	IsMaximum int       `gorm:"type:int" json:"is_maximum"`
}

func (Sensor) TableName() string {
	return "sensors"
}
