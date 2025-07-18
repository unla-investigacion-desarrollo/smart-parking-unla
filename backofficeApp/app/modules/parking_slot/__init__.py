from flask import Blueprint
parking_slot_blueprint = Blueprint("parking_slot", __name__,static_folder='files',url_prefix='/parking_slot')
from . import ParkingSlotController
