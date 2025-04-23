from . import process_data_blueprint
import os,json
from app.models import SensorData,Sensor
from flask import Flask, jsonify
from app import firedb 

@process_data_blueprint.route('/')
def index():
    sensors = Sensor.query.all()
    for sensor in sensors:
        user_ref = firedb.collection('sensors').document(sensor.sensor_id)
        user_ref.set({
            'sensor_id': sensor.sensor_id,
            'name': sensor.name,
            'distance': sensor.distance,
            'latitude': sensor.latitude,
            'longitude': sensor.longitude,
            'free': sensor.free,
            'created_at': sensor.created_at,
            'updated_at': sensor.updated_at
        })
        
    sensors_list = [ {key: value for key, value in vars(sensor).items() if not key.startswith('_')} for sensor in sensors ]
    
    return jsonify(sensors_list), 200

