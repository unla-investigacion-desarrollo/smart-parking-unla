primero ejecutar con el nombre del usuario que queremos al final. eso crea el passwordfile y el usuario
docker run --rm -it -v ./config:/mosquitto/config eclipse-mosquitto mosquitto_passwd -c /mosquitto/config/passwordfile myuser


cada vez que se reinicia hay que crear un nuevo passwordfile porque el nuevo contenedor no puede leer el passwordfile viejo