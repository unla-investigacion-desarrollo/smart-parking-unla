from . import control_sensor_blueprint
import os,json
from app.models import SensorData,Sensor
from . import control_sensor_blueprint
from flask import render_template, request, jsonify
from flask_login import login_required, current_user
from app import firedb 


@control_sensor_blueprint.route('/')
@login_required
def index():
    return render_template("home.html", user=current_user)

