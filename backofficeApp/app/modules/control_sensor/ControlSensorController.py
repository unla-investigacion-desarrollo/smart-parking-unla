from . import control_sensor_blueprint
import os,json
from app.models import SensorData,Sensor
from . import control_sensor_blueprint
from flask import render_template, request, jsonify
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
    per_page = 10  # Items per page

    pagination = db.session.query(SensorData).order_by(SensorData.updated_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return render_template(
        'sensor_data.html',
        sensor_data=pagination.items,
        pagination=pagination,
        user=current_user,
    )

