import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from '../sensor-data.entity';
import { Sensor } from '../sensor.entity';
import { FirebaseService } from './firebase.service';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
    @InjectRepository(Sensor)
    private readonly sensorRepo: Repository<Sensor>,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron('0 */3 7-22 * * *') // https://docs.nestjs.com/techniques/task-scheduling
  async handleCron() {
    const getSensors = await this.sensorRepo.find();
    for (const sensorDB of getSensors) {  
      console.log(sensorDB)
      const unprocessed = await this.sensorDataRepo.find({ where: { processed: 0,sensor_id: sensorDB.sensor_id },take: 1 }); //TODO: remove take 1 for production
      
      for (const row of unprocessed) {
        const free =  row.distance < sensorDB.distance ? 0 : 1;
        await this.firebaseService.sendToFirestore(
          'sensors_av',         
          row.sensor_id, 
          {
            sensor_id: row.sensor_id,
            distance: row.distance,
            updated_at: row.updated_at,
            free: free,
          },
        );

        row.processed = 1;
        await this.sensorDataRepo.save(row);
      }
    }
  }
}
