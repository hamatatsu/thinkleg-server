const express = require('express');
const socket = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3001;
const server = app.listen(port, () => {
  console.log(`listening on *:${port}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"],
  }
});
io.on('connection', (socket) => {
  socket.emit('system', "ok");
  socket.on('getData', (msg) => {
    console.log(msg)
    socket.emit('message', [{ x: 100, y: 250 }]);
  });
});
