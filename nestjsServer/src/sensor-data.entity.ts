import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sensors_data')
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensor_id: string;

  @Column({ type: 'decimal'})
  distance: number;

  @Column()
  processed: number;

  @Column({ type: 'timestamp'})
  updated_at: Date;
}
