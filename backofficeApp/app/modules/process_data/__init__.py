from flask import Blueprint
process_data_blueprint = Blueprint("process_data", __name__,static_folder='files')

from . import ProcessDataController
