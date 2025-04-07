from flask import Flask
import os

DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

def create_app():
    print("creando app")
    app = Flask(__name__)
    
    register_blueprints(app)
    return app

def register_blueprints(app):
    print("register_blueprints app")
    from app.modules.control_sensor import control_sensor_blueprint
    from app.modules.process_data import process_data_blueprint
    from app.modules.add_sensor import add_sensor_blueprint
    from app.models import db
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://avnadmin:AVNS_oV7cITaB-aW9tTsGHqB@peseteres-postgresqldb-pato-ef11.g.aivencloud.com:25628/defaultdb"
    "?sslmode=verify-ca&sslrootcert=aiven_db_cert.crt"
    #app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://postgres:123456@localhost:5432/test'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
