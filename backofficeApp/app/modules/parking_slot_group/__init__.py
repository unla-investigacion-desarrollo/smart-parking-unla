from flask import Blueprint
parking_slot_group_blueprint = Blueprint("parking_slot_group", __name__,static_folder='files',url_prefix='/parking_slot_group')

from . import ParkingSlotGroupController