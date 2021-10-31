import dotenv from 'dotenv';
import { connect } from 'mqtt';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool();

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query(
    'DROP TABLE IF EXISTS test CASCADE; CREATE TABLE test (id serial, date integer, leg smallint, PRIMARY KEY (id));',
    (err, result) => {
      release();
      if (err) console.error('Error executing query', err.stack);
      console.log(result.rows);
    }
  );
});

const mqttClient = connect('mqtt://host.docker.internal', {
  username: process.env.MQTTUSER,
  password: process.env.MQTTPASSWORD,
});

mqttClient.on('connect', () => {
  mqttClient.subscribe('presence', (err) => {
    if (!err) {
      mqttClient.publish('presence', 'Hello mqtt');
    }
  });
  mqttClient.subscribe('test');
});
mqttClient.on('error', (err) => console.error(err));
mqttClient.on('message', (topic, message) => {
  if (topic === 'presence') console.log(message.toString());
  if (topic === 'test') {
    const json = JSON.parse(message.toString());
    pool.connect((err, client, release) => {
      client.query(
        `INSERT INTO test (date, leg) values (${json['date']}, ${json['leg']})`,
        (err) => {
          release();
          if (err) console.error('Error executing query', err.stack);
        }
      );
    });
  }
});

process.on('beforeExit', () => {
  mqttClient.end();
  pool.end();
});
