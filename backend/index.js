/* eslint-disable no-console */
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
const loadLastCardEvents = require('./Events/LastCardEvents');
const LobbyManager = require('./Domain/LobbyManager');

const lobbyManager = new LobbyManager();

io.on('connection', (socket) => {
  console.log('A new user has connected.');
  loadCodenamesEvents(io, socket, lobbyManager);
  loadLobbyEvents(io, socket, lobbyManager);
  loadPokerEvents(io, socket, lobbyManager);
  loadLastCardEvents(io, socket, lobbyManager);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  // loadCodenamesEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// Export the server and lobbyManager object for testing
exports.server = server;
exports.io = io;
exports.lobbyManager = lobbyManager;
