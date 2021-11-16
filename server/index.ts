import dotenv from 'dotenv';
import { connect } from 'mqtt';
import { Pool } from 'pg';

dotenv.config();

type Data = {
  date: string;
  leg: string;
};

const pool = new Pool();

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT current_database()', (err, result) => {
    release();
    if (err) console.error('Error executing query', err.stack);
    console.log(result.rows);
  });
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
  mqttClient.subscribe('legdata/#');
});
mqttClient.on('error', (err) => console.error(err));
mqttClient.on('message', (topic, message) => {
  if (topic === 'presence') console.log(message.toString());
  if (topic.startsWith('legdata')) {
    const device = topic.split('/')[1];
    const json = JSON.parse(message.toString()) as Data[];
    pool.connect((err, client, release) => {
      client.query(
        `CREATE TABLE IF NOT EXISTS ${device} (id SERIAL, date TIMESTAMPTZ, leg SMALLINT, PRIMARY KEY (id))`,
        (err) => {
          if (err) console.error('Error executing query', err.stack);
        }
      );
      const values = json
        .map((value) => `('${value['date']} JST', ${value['leg']})`)
        .join(',');
      client.query(
        `INSERT INTO ${device} (date, leg) VALUES ${values}`,
        (err) => {
          if (err) console.error('Error executing query', err.stack);
        }
      );
      release();
    });
  }
});

process.on('beforeExit', () => {
  mqttClient.end();
  pool.end();
});
