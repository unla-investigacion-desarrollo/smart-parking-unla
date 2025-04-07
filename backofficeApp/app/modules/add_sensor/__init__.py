from flask import Blueprint
add_sensor_blueprint = Blueprint("add_sensor", __name__,static_folder='files')

from . import AddSensorController
