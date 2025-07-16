import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('parking_slot')
export class ParkingSlot {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'bigint', unique: true })
  @Index()
  sensor_id: number;

  @Column({ type: 'bigint', unique: true })
  @Index()
  parking_slot_group_id: number;

  @Column({ type: 'float' })
  distance: number;

  @Column({ type: 'varchar', length: 255 })
  latitude: string;

  @Column({ type: 'varchar', length: 255 })
  longitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 50, default: 'libre' })
  status: 'libre' | 'ocupado' | 'reservado';

  @Column({ type: 'int', default: 0 })
  free: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
