from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy import Column, Integer, String, TIMESTAMP, DateTime
db = SQLAlchemy()

class SensorData(db.Model):
    __tablename__ = 'sensors_data_new'
    id = sa.Column(sa.BigInteger, primary_key=True,autoincrement=True)
    sensor_id = sa.Column(sa.String(255),nullable=False,index=True)
    distance = sa.Column(sa.Float,nullable=False)
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
