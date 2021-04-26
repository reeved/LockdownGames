const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 6001;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // Allow all origin to connect to the website
  },
});

app.get('/', (req, res) => {
  res.send('The server is running');
});

const loadCodenamesEvents = require('./Events/CodenamesEvents');
const loadLobbyEvents = require('./Events/LobbyEvents');
const loadPokerEvents = require('./Events/PokerEvents');
const LobbyManager = require('./Domain/LobbyManager');

const lobbyManager = new LobbyManager();

io.on('connection', (socket) => {
  console.log('A new user has connected.');
  loadCodenamesEvents(io, socket);
  loadLobbyEvents(io, socket, lobbyManager);
  loadPokerEvents(io, socket, lobbyManager);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  //loadCodenamesEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
