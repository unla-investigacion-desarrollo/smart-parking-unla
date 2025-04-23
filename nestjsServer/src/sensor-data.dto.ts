import { IsNumberString, IsString,IsNumber } from 'class-validator';

export class SensorDataDto {
  @IsString()
  sensor_id: string;

  @IsNumberString()
  distance: string;

  @IsNumber()
  processed: number;

  @IsNumber()
  updated_at: number;
}