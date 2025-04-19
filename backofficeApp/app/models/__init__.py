from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy import Column, Integer, String, TIMESTAMP, DateTime
from flask_login import UserMixin,LoginManager
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
login_manager = LoginManager()

class SensorData(db.Model):
    __tablename__ = 'sensors_data_new'
    id = sa.Column(sa.BigInteger, primary_key=True,autoincrement=True)
    sensor_id = sa.Column(sa.String(255),nullable=False,index=True)
    distance = sa.Column(sa.Float,nullable=False)
    processed = sa.Column(sa.Integer,default=0)
    updated_at = sa.Column(TIMESTAMP(timezone=False), nullable=False)
    
class Sensor(db.Model):
    __tablename__ = 'sensors_new'
    id = sa.Column(sa.BigInteger, primary_key=True,autoincrement=True)
    name = sa.Column(sa.String(255),nullable=False,unique=True)
    sensor_id = sa.Column(sa.String(255),nullable=False,index=True,unique=True)
    distance = sa.Column(sa.Float,nullable=False)
    latitude = sa.Column(sa.String(255),nullable=False)
    longitude = sa.Column(sa.String(255),nullable=False)
    free = sa.Column(sa.Integer,default=0)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)   

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = sa.Column(sa.Integer, primary_key=True)
    email = sa.Column(sa.String(150), unique=True, nullable=False)
    password_hash = sa.Column(sa.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
