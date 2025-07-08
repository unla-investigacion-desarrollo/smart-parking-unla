from . import control_sensor_blueprint
import random
import string
from flask import redirect, url_for,render_template, request
from app.models import SensorData,Sensor
from . import control_sensor_blueprint
from flask_login import login_required, current_user
from app import firedb 
from app import db



@control_sensor_blueprint.route('/')
@login_required
def index():
    sensors_av = firedb.collection('sensors_av')
    docs = sensors_av.stream()
    properties = []
    for doc in docs:
        property_data = doc.to_dict()
        property_data['id'] = doc.id  
        properties.append(property_data)

    return render_template("home.html", properties=properties,user=current_user)

@control_sensor_blueprint.route('/sensors_data')
@login_required
def sensor_data():
    page = request.args.get('page', 1, type=int)
    per_page = 20  # Items per page
    pagination = SensorData.query.order_by(SensorData.updated_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return render_template(
        'sensor_data.html',
        sensor_data=pagination.items,
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