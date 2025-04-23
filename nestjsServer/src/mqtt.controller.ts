import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MqttService } from './services/mqtt.service';
import { SensorDataDto } from './sensor-data.dto';

@Controller()
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @MessagePattern('testtopic/sensors')
  async handleMessage(@Payload() payload: SensorDataDto) {
    //console.log('MQTT message received:', payload);
    await this.mqttService.insertSensorData(payload);
  }
}