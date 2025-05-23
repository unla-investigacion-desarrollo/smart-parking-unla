import { Module } from '@nestjs/common';
import { SensorData } from './sensor-data.entity';
import { Sensor } from './sensor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MqttController } from './mqtt.controller';
import { MqttService } from './services/mqtt.service';
import { FirebaseService } from './services/firebase.service';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';

import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const caPath = config.get<string>('DB_CA_PATH');
        
        if (!caPath) {
          throw new Error('CA certificate path is not defined in .env');
        }

        const ca = fs.readFileSync(path.resolve(__dirname, '..', caPath)).toString();

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: config.get<string>('DB_NAME'),
          entities: [SensorData,Sensor],
          synchronize: false, 
          ssl: {
            ca,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([SensorData,Sensor]),
  ],
  controllers: [MqttController],
  providers: [MqttService,FirebaseService,CronService],
})
export class AppModule {}
