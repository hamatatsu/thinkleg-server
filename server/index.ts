import dotenv from 'dotenv';
import { connect } from 'mqtt';
import { Pool } from 'pg';

dotenv.config();

const mqttClient = connect('mqtt://host.docker.internal', {
  username: process.env.MQTTUSER,
  password: process.env.MQTTPASSWORD,
});

const pool = new Pool();
pool.connect();

mqttClient.on('connect', () => {
  mqttClient.subscribe('presence', (err) => {
    if (!err) {
      mqttClient.publish('presence', 'Hello mqtt');
    }
  });
});
mqttClient.on('error', (err) => console.error(err));
mqttClient.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
  mqttClient.end();
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);
  });
});

pool.end();
