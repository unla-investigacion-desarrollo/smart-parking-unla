from venv import logger
from . import control_sensor_blueprint
import random
import string
from flask import redirect, url_for,render_template, request
from app.models import SensorData,Sensor,ParkingSlot
from . import control_sensor_blueprint
from flask_login import login_required, current_user
from app import firedb,db 
from datetime import datetime,timedelta,timezone


@control_sensor_blueprint.route('/')
@login_required
def index():
    sensors_av = firedb.collection('sensors_av')
    docs = sensors_av.stream()
    properties = []
    for doc in docs:
        sensor_data = doc.to_dict()
        sensor_data['disconnected'] = False
        now = datetime.now(timezone.utc)
        iso_string = sensor_data['updated_at']
        excluded_hours = [3, 4, 5, 6, 7, 8, 9] 
        py_date = datetime.fromisoformat(iso_string.replace("Z", "+00:00"))
        if (now - py_date > timedelta(hours=1)) and (now.hour not in excluded_hours):
            sensor_data['disconnected'] = True
        
        sensor_data['updated_at'] = py_date.strftime('%Y-%m-%d %H:%M:%S')
        sensor_data['id'] = doc.id
        properties.append(sensor_data)

    return render_template("home.html", properties=properties,user=current_user)

@control_sensor_blueprint.route('/sensors_data')
@login_required
def sensor_data():
    page = request.args.get('page', 1, type=int)
    per_page = 50  # Items per page
    pagination = SensorData.query.order_by(SensorData.updated_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    processed_data = []
    for row in pagination.items:
        sensor = Sensor.query.filter_by(sensor_uid=row.sensor_uid).first()
        row.parking_slot = ParkingSlot.query.filter_by(sensor_id=sensor.id).first()
        #datetime_object = datetime.strptime(row.updated_at, '%y/%md/%d %H:%M:%S')
        locale_hour = row.updated_at - timedelta(hours=3)
        row.updated_at = locale_hour
        processed_data.append(row)

    return render_template(
        'sensor_data.html',
        sensor_data=processed_data,
        pagination=pagination,
        user=current_user,
    )

@control_sensor_blueprint.route('/sensors')
@login_required
def list_sensors():
    page = request.args.get('page', 1, type=int)
    per_page = 10
    pagination = Sensor.query.paginate(page=page, per_page=per_page, error_out=False)
    sensors = pagination.items

    return render_template('list_sensors.html', sensors=sensors, pagination=pagination)

@control_sensor_blueprint.route('/add_sensor', methods=['GET', 'POST'])
@login_required
def add_sensor():
    if request.method == 'POST':
        name = request.form.get('name')
        distance = request.form.get('distance')
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')

        sensor_uid =  generate_uid()

        new_sensor = Sensor(
            name=name,
            sensor_uid=sensor_uid,
            distance=float(distance),
            latitude=latitude,
            longitude=longitude,
        )

        db.session.add(new_sensor)
        try:
            db.session.commit()
            return redirect(url_for('control_sensor.list_sensors'))
        except Exception as e:
            db.session.rollback()

    return render_template('add_sensor.html')


def generate_uid(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


@control_sensor_blueprint.route('/sensors/delete/<int:sensor_id>', methods=['POST'])
def delete_sensor(sensor_id):
    sensor = Sensor.query.get(sensor_id)
    if sensor:
        db.session.delete(sensor)
        db.session.commit()
    return redirect(url_for('control_sensor.list_sensors'))

@control_sensor_blueprint.route('/generate-env', methods=['POST'])
def generate_env():
    selected_sensor_ids = request.form.getlist('sensor_ids')
    
    if len(selected_sensor_ids) > 4 or len(selected_sensor_ids) == 0:
        return redirect(url_for('control_sensor.list_sensors'))
    
    sensors = Sensor.query.filter(Sensor.id.in_(selected_sensor_ids)).all()
    
    return render_template('wifi_config.html', sensors=sensors)

@control_sensor_blueprint.route('/generate-config', methods=['GET'])
def generate_config():
    selected_sensor_ids = request.args.getlist('sensor_ids[]')
    
    if len(selected_sensor_ids) > 4 or len(selected_sensor_ids) == 0:
        return redirect(url_for('control_sensor.list_sensors'))
    
    try:
        selected_sensor_ids = [int(id) for id in selected_sensor_ids]
    except ValueError:
        return redirect(url_for('control_sensor.list_sensors'))
    
    # Query the database to get the actual sensor objects
    selected_sensors = Sensor.query.filter(Sensor.id.in_(selected_sensor_ids)).all()

    # Get WiFi credentials from the form
    wifi_ssid = request.args.get('wifi_ssid', '')
    wifi_password = request.args.get('wifi_password', '')

    # Generate the configuration content
    sensor_uids = [sensor.sensor_uid for sensor in selected_sensors]
    sensor_config = ""
    for i, sensor_uid in enumerate(sensor_uids, start=12):
        sensor_config += f'  {{"{sensor_uid}", {i + 1}}},\n'

    env_content = f'''
#ifndef CONF_H
#define CONF_H

#define TRIG_PIN 12

struct Sensor {{
  const char* uid;
  int echoPin;
}}; 

const Sensor sensors[] = {{{sensor_config}}};

const int NUM_SENSORS = sizeof(sensors) / sizeof(sensors[0]);

const char *WIFI_SSID = "{wifi_ssid}";
const char *WIFI_PASSWORD = "{wifi_password}";

const char *MQTT_BROKER_HOST = "127.0.0.0";
const int MQTT_BROKER_PORT = 1883;
const char *MQTT_BROKER_TOPIC = "testtopic/sensors";
const char *MQTT_BROKER_USERNAME = "myuser";
const char *MQTT_BROKER_PASSWORD = "mypassword";

const int TIME_DELAY = 30000;

#endif
'''

    # Return the generated config content to be shown on the screen or allow downloading
    return render_template('download_config.html', config=env_content)