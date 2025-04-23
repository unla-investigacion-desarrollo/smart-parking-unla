from flask import Blueprint
control_sensor_blueprint = Blueprint("control_sensor", __name__,static_folder='images',url_prefix='/control_sensor')
from . import ControlSensorController


