from . import parking_slot_group_blueprint
from flask_login import login_required, current_user
from flask import render_template, request, redirect, url_for, flash
from app import db
from app.models import ParkingSlotGroup, Sensor, ParkingSlot

# Create Parking Slot Group
@parking_slot_group_blueprint.route('/create', methods=['GET', 'POST'])
@login_required
def create_parking_slot_group():
    if request.method == 'POST':
        name = request.form['name']
        if not name:
            return redirect(url_for('parking_slot_group.create_parking_slot_group'))

        new_group = ParkingSlotGroup(name=name)
        db.session.add(new_group)
        db.session.commit()

        return redirect(url_for('parking_slot_group.list_parking_slot_groups'))

    return render_template('create_parking_slot_group.html')


# List Parking Slot Groups
@parking_slot_group_blueprint.route('/parking_slot_groups') 
@login_required
def list_parking_slot_groups():
    groups = ParkingSlotGroup.query.all()
    return render_template('list_parking_slot_groups.html', groups=groups)


# Update Parking Slot Group
@parking_slot_group_blueprint.route('/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_parking_slot_group(id):
    group = ParkingSlotGroup.query.get(id)
    if not group:
        return redirect(url_for('parking_slot_group.list_parking_slot_groups'))

    if request.method == 'POST':
        group.name = request.form['name']
        db.session.commit()
        return redirect(url_for('parking_slot_group.list_parking_slot_groups'))

    return render_template('edit_parking_slot_group.html', group=group)


# Delete Parking Slot Group
@parking_slot_group_blueprint.route('/delete/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_parking_slot_group(id):
    group = ParkingSlotGroup.query.get(id)
    if not group:
        return redirect(url_for('parking_slot_group.list_parking_slot_groups'))

    db.session.delete(group)
    db.session.commit()
    return redirect(url_for('parking_slot_group.list_parking_slot_groups'))
