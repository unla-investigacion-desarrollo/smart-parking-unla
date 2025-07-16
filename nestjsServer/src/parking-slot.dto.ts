import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class ParkingSlotDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  sensor_id?: number;

  @IsOptional()
  @IsNumber()
  parking_slot_group_id?: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsIn(['libre', 'ocupado', 'reservado'])
  status?: 'libre' | 'ocupado' | 'reservado';

  @IsOptional()
  @IsNumber()
  free?: number;
}
