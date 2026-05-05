## Funcionamiento
El funcionamiento es el siguiente: desarrollamos de forma local y luego hacemos el build. Ese build subimos a prod.

### development mode
docker compose -f docker-compose.local.yml up --build

### prod mod
(Locally)
docker build --target prod -t smartparkin:1.0.0 .

#### chequeamos que este bien el build
docker images | grep smartparkin
#### exportamos la imagen como un archivo
docker save smartparkin:1.0.0 | gzip > builds/smartparkin-1.0.0.tar.gz
#### upload file to prod
scp smartparkin-1.0.0.tar.gz user@PROD_SERVER:/var/www/smart-parking-unla/GoServer/builds

#### load imagen on prod
cd /var/www/smart-parking-unla/GoServer/builds
docker load < smartparkin-1.0.0.tar.gz

#### run in prod
cd /var/www/smart-parking-unla/GoServer
docker compose -f docker-compose.yml up --build
