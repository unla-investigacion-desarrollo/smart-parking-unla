const mqtt = require('mqtt');
const { Client } = require('pg');

// MQTT client setup
/*const mqttClient = mqtt.connect('mqtt://broker.emqx.io:1883', {
    username: 'emqx',
    password: 'public'
});*/
const mqttClient = mqtt.connect('mqtt://206.189.237.167:1883', {
    username: 'patricio23',
    password: 'entrar123'
});
const topic = 'testtopic/sensors';

// PostgreSQL client setup
const pgClient = new Client({
    user: 'avnadmin',
    host: 'peseteres-postgresqldb-pato-ef11.g.aivencloud.com',
    database: 'defaultdb',
    password: 'AVNS_oV7cITaB-aW9tTsGHqB',
    port: 25628,
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIULSXVETEUIDhS1eeDA3TFeDtEOB0wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZTNmMTVhYjItYTc1Yy00MTI0LWIxYjEtMzA2MGZiNjUw
ZDJkIFByb2plY3QgQ0EwHhcNMjQwMzI2MTE1MjU0WhcNMzQwMzI0MTE1MjU0WjA6
MTgwNgYDVQQDDC9lM2YxNWFiMi1hNzVjLTQxMjQtYjFiMS0zMDYwZmI2NTBkMmQg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAKGEcmQV
MQWggAJdH4MSEMWdmaLyYxBE6EPAOYU3fWZTyMJfWxMCwwgpNRBSyUoCHK7fc+a/
MlxFWQ8AgpaRlIX0r+1pAlqrC2JRvWxCi1lOzYYTg9+N/13kvpT/yVMIVS8yZQVC
led2lfUUUdqyGz9FDE6JzC2lXLYaYAoYeZGp1k/bi8qLUyGOVfeALWA3m1pCldDp
zAIMHZDoSae1Jwb1DeoRW/7MAdEgmCKGGdBcv7J15ltDssFd8YySLtGZnuZHfhUI
qqcvv1WpEqZ6VSOx4cYFGCTxEk0DfDlVHXKTl8dFN2OcBi6M+a6djYwD35oKDISJ
jBq1ttj9XkwE5GPakpiGhlEafCoTuT+yjufXx+5GbT7ziflp416t6JCxMfg6Zn7E
yg58NXDnOEvwVf2ae5d5lgiJUfaLJzk2jVWsp3W4iJixSGGQyD3F3cuAOGDiijIl
beg14xoKVcMDyXzQecz7bIfTiMQAGQFvYltkDjT2bGfXLEhszpwoLAd19QIDAQAB
oz8wPTAdBgNVHQ4EFgQU+DXrxvfrkx6aeIZ2UFvvDVeYhUYwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAJ9/dNcdpihpHLwG
q9xIIpE3VH/pEgQzR2kkmEJ92eg1BYFAT8fEgoS7/GJZG8do15b2lfSXqLaNMilh
CJacE0fYP8uc3oviZusEdKifBFGjWF+fBRSsbq90OEALgaiVIp7jZa7wlDOVsNbH
2EKGCFUehhaId9lkVpZPSDtQYMV4f3QLavksBpYQE67a6aeewTARVf6H7kphPepw
TvlZxAedhvwxy65J2qYow1HERSW/K8ki7AagWQmPD/6RZzYEtGUk0Ozln9ty2nnm
51cgUbQv7WNdv8p30cDXGb9xyI5+DPwCbSN6YCE/JRATOD6gnlZibYjh+tdOrr/c
/fhrePlkpFKkfxNwryaZixc49WoOg2RMGZq3Q5noWIwN4ilH/Yim0mjszthEeK7b
5mVhiJmOz9p21QIdTtNtpz8ywMTqUMEtJStf3ROYIjzDaY3Vhw4DAM6wvd6EhzbU
bG9lJBLLUwfSP+kzk4gWo3KPXQIaWshcOG1/kfXbPOAZAXYuAg==
-----END CERTIFICATE-----`,
    },
});

pgClient.connect();

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log(data);
    const { sensor_id, distance,updated_at } = data;
    /*const sensor_id = "sensorid";
    const {distance} = data;
    const updated_at = new Date();*/

    const query = 'INSERT INTO sensor_data (sensor, updated_at,distance) VALUES ($1, $2, $3)';
    const values = [sensor_id, updated_at,distance];

    pgClient.query(query, values, (err, res) => {
        if (err) {
            console.error('Error inserting data into PostgreSQL', err);
        } else {
            console.log('Data inserted successfully');
        }
    });
});

process.on('exit', () => {
    pgClient.end();
    mqttClient.end();
});