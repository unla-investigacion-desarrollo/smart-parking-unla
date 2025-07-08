import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from '../sensor-data.entity';
import { SensorDataDto } from '../sensor-data.dto';

@Injectable()
export class MqttService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
  ) {}

  async insertSensorData(data: SensorDataDto): Promise<SensorData> {
    const entry = this.sensorDataRepo.create({
        ...data,
        sensor_uid: data.sensor_id,
        distance: parseFloat(data.distance),
        processed: data.processed,
        updated_at: new Date(data.updated_at * 1000),
      });
    return this.sensorDataRepo.save(entry);
  }
}
