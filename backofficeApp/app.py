from app import create_app
from app.models import SensorData,Sensor
from flask_login import login_user, logout_user, login_required, current_user
from flask import request, render_template, redirect
from app.models import User

app = create_app()


@app.route('/')
@login_required
def home():
    return render_template("home.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        if not email or not password:
            return "Missing email or password", 400

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)
            return redirect("/")
        return "Invalid credentials", 401

    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/login")    

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=5005)

