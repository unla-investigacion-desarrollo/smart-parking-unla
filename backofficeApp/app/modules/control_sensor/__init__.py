from flask import Blueprint
control_sensor_blueprint = Blueprint("control_sensor", __name__,static_folder='files')

from . import ControlSensorController
