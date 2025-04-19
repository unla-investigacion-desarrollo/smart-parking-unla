from flask import Flask
from flask_login import LoginManager
from dotenv import load_dotenv
import os,logging
from app.models import User

load_dotenv() 
login_manager = LoginManager()
logger = logging.getLogger()

DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv("SECURITY_SUPERKEY")
    login_manager.init_app(app)
    login_manager.login_view = "login"
    
    register_blueprints(app)
    return app

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def register_blueprints(app):
    from app.modules.control_sensor import control_sensor_blueprint
    from app.modules.process_data import process_data_blueprint
    from app.modules.add_sensor import add_sensor_blueprint
    from app.models import db
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://%s:%s@%s:%s/%s?sslmode=verify-ca&sslrootcert=aiven_db_cert.crt" % (DB_USER,DB_PASSWORD,DB_HOST,DB_PORT,DB_NAME)
    #app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://postgres:123456@localhost:5432/test'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
        # creamos usuario de prueba
        #user = User(email="pepe@example.com")
        #user.set_password("supersecret")
        #db.session.add(user)
        #db.session.commit()
