import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from '../sensor-data.entity';
import { Sensor } from '../sensor.entity';
import { FirebaseService } from './firebase.service';
import { ParkingSlot } from 'src/parking-slot.entity';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
    @InjectRepository(Sensor)
    private readonly sensorRepo: Repository<Sensor>,
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepo: Repository<ParkingSlot>,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron('* */3 * 7-22 * *') // https://docs.nestjs.com/techniques/task-scheduling
  async handleCron() {
    const getSensors = await this.sensorRepo.find();
    for (const sensorDB of getSensors) {  
      //console.log(sensorDB)
      const unprocessed = await this.sensorDataRepo.find({ where: { processed: 0,sensor_uid: sensorDB.sensor_uid },take: 10 }); //TODO: remove take 1 for production

      let averageDistance = 0;
      let totalDistance = 0;
      // de todos los datos sin procesar, si el promedio de la distancia es menor a la distancia del sensor, se considera ocupado
      if (unprocessed.length > 0) {
        for (const row of unprocessed) {
          totalDistance += row.distance;
          row.processed = 1;
          await this.sensorDataRepo.save(row);
        }
        // calcular el promedio de la distancia
        totalDistance = parseFloat(totalDistance.toFixed(2));
        averageDistance = totalDistance / unprocessed.length;
        await this.processSensorUpdate(sensorDB, averageDistance);

      }
    }
  }

  private async processSensorUpdate(sensor: Sensor, averageDistance: number): Promise<void> {
    let processedFree = 1;
    let processedStatus: 'libre' | 'ocupado' = 'libre';

    if (averageDistance > 0 && averageDistance < sensor.distance) {
      processedFree = 0;
      processedStatus = 'ocupado';
    }

    // Update the ParkingSlot
    await this.parkingSlotRepo.update(
      { sensor_id: sensor.id },
      {
        free: processedFree,
        status: processedStatus,
        distance: averageDistance,
        updated_at: new Date(),
      },
    );

    const updatedParkingSlot = await this.parkingSlotRepo.findOne({
    where: { sensor_id: sensor.id },
    });
    // Update Firebase
    await this.firebaseService.sendToFirestore(
      'sensors_av_ps',
      sensor.sensor_uid,
      JSON.parse(JSON.stringify(updatedParkingSlot)),
    );
  }


}