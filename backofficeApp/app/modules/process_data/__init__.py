from flask import Blueprint
process_data_blueprint = Blueprint("process_data", __name__,static_folder='images',url_prefix='/process_data')

from . import ProcessDataController
