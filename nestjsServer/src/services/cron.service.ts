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

  @Cron('/3 * 7-22 * * *') // https://docs.nestjs.com/techniques/task-scheduling
  async handleCron() {
    const getSensors = await this.sensorRepo.find();
    for (const sensorDB of getSensors) {  
      console.log(sensorDB)
      const unprocessed = await this.sensorDataRepo.find({ where: { processed: 0,sensor_uid: sensorDB.sensor_uid },take: 10 }); //TODO: remove take 1 for production
      let processedFree = 1;
      let processedStatus = 'libre';
      let averageDistance = 0;
      let totalDistance = 0;
      // de todos los datos sin procesar, si el promedio de la distancia es menor a la distancia del sensor, se considera ocupado
      if (unprocessed.length === 0) {
        for (const row of unprocessed) {
          totalDistance += row.distance;
          averageDistance = totalDistance / unprocessed.length;
          row.processed = 1;
          await this.sensorDataRepo.save(row);
        }
        if(averageDistance > 0 && averageDistance < sensorDB.distance) {
          processedFree = 0;
          processedStatus = 'ocupado';
        }
        await this.firebaseService.sendToFirestore(
            'sensors_av',         
            sensorDB.sensor_uid, 
            {
              sensor_id: sensorDB.id,
              name: sensorDB.name,
              sensor_uid: sensorDB.sensor_uid,
              distance: averageDistance,
              updated_at: new Date(),
              free: processedFree,
              status: processedFree,
            },
          );
      }
    }
  }
}
