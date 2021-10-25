import express from 'express';
import next from 'next';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextServer = next({ dev });
const handle = nextServer.getRequestHandler();

nextServer.prepare().then(() => {
  const app = express();

  app.all('*', (req, res) => {
    return handle(req, res);
  });
  const server = app.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
      }`);
  });

  const io = new Server(server);
  io.on('connection', (socket) => {
    socket.emit('system', 'ok');
    socket.on('getData', (msg) => {
      console.log(msg);
      socket.emit('message', "test message");
    });
  });
});