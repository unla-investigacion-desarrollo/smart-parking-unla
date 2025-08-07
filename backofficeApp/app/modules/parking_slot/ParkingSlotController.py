from . import parking_slot_blueprint
from flask import redirect, url_for,render_template, request
from app.models import Sensor,ParkingSlotGroup,ParkingSlot
from . import parking_slot_blueprint
from flask_login import login_required, current_user
from app import firedb 
from app import db

@parking_slot_blueprint.route('/create', methods=['GET', 'POST'])
@login_required
def create_parking_slot():
    sensors = Sensor.query.all()
    parking_slot_groups = ParkingSlotGroup.query.all()

    if request.method == 'POST':
        name = request.form['name']
        sensor_id = request.form['sensor_id']
        parking_slot_group_id = request.form['parking_slot_group_id']
        distance = request.form['distance']
        latitude = request.form['latitude']
        longitude = request.form['longitude']
        image = request.form['image']
        status = request.form.get('status', 'libre')  # default to 'libre'

        if not name or not sensor_id or not parking_slot_group_id or not distance or not latitude or not longitude:
            return redirect(url_for('parking_slot.create_parking_slot'))

        sensor = Sensor.query.get(sensor_id)
        parking_slot_group = ParkingSlotGroup.query.get(parking_slot_group_id)

        if not sensor or not parking_slot_group:
            return redirect(url_for('create_parking_slot'))

        new_slot = ParkingSlot(
            name=name,
            sensor_id=sensor_id,
            parking_slot_group_id=parking_slot_group_id,
            distance=distance,
            latitude=latitude,
            longitude=longitude,
            image=image,
            status=status
        )
        db.session.add(new_slot)
        db.session.commit()

        return redirect(url_for('parking_slot.list_parking_slots'))

    return render_template('create_parking_slot.html', sensors=sensors, parking_slot_groups=parking_slot_groups)


@parking_slot_blueprint.route('/parking_slots')
@login_required
def list_parking_slots():
    slots = db.session.query(ParkingSlot, ParkingSlotGroup,Sensor)\
    .join(ParkingSlotGroup, ParkingSlot.parking_slot_group_id == ParkingSlotGroup.id)\
    .join(Sensor, ParkingSlot.sensor_id == Sensor.id)\
    .all()
    return render_template('list_parking_slots.html', slots=slots)


@parking_slot_blueprint.route('/parking_slot/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_parking_slot(id):
    slot = ParkingSlot.query.get(id)
    sensors = Sensor.query.all()
    parking_slot_groups = ParkingSlotGroup.query.all()

    if not slot:
        return redirect(url_for('parking_slot.list_parking_slots'))

    if request.method == 'POST':
        slot.name = request.form['name']
        slot.sensor_id = request.form['sensor_id']
        slot.parking_slot_group_id = request.form['parking_slot_group_id']
        slot.distance = request.form['distance']
        slot.latitude = request.form['latitude']
        slot.longitude = request.form['longitude']
        slot.image = request.form['image']
        slot.status = request.form['status']
        db.session.commit()

        return redirect(url_for('list_parking_slots'))

    return render_template('edit_parking_slot.html', slot=slot, sensors=sensors, parking_slot_groups=parking_slot_groups)


@parking_slot_blueprint.route('/parking_slot/delete/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_parking_slot(id):
    slot = ParkingSlot.query.get(id)
    if not slot:
        return redirect(url_for('list_parking_slots'))

    db.session.delete(slot)
    db.session.commit()
    return redirect(url_for('list_parking_slots'))
