import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sensor_uid: string;

  @Column({ type: 'decimal'})
  distance: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column({ type: 'timestamp'})
  created_at: Date;

  @Column({ type: 'timestamp'})
  updated_at: Date;
}
