package models

import "time"

type SensorData struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	SensorUID string    `gorm:"type:varchar(255)" json:"sensor_uid"`
	Distance  float64   `gorm:"type:decimal" json:"distance"`
	Processed int       `gorm:"type:boolean" json:"processed"`
	UpdatedAt time.Time `gorm:"type:timestamp" json:"updated_at"`
	CreatedAt time.Time `gorm:"type:timestamp" json:"created_at"`
}

func (SensorData) TableName() string {
	return "sensors_data"
}

// formato de la data que viene de la placa
type SensorDataMessage struct {
	Distance  float64 `json:"distance"`
	CreatedAt int64   `json:"created_at"`
	SensorID  string  `json:"sensor_id"`
	Processed int     `json:"processed"`
}
