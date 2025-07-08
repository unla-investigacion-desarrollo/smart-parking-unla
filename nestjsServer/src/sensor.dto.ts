import { IsString,IsNumber, IsDate } from 'class-validator';

export class SensorDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  sensor_uid: string;

  @IsNumber()
  distance: number;

  @IsNumber()
  free: number;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}