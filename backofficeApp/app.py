from app import create_app
from app.models import SensorData,Sensor
app = create_app()

@app.route('/')
def hello():
    print("hola")
    return "hi,new Docker!233"


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=5005)

