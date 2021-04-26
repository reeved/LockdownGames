/* eslint-disable no-console */
const Player = require('../Domain/Player');

function createLobby(io, socket, lobbyManager) {
  socket.on('create-lobby', (nickname) => {
    const lobby = lobbyManager.createLobby();
    const host = new Player(nickname, socket.id, lobby.roomID, true);
    lobby.addPlayer(host);
    lobby.host = host;
    socket.join(lobby.roomID);
    socket.player = host;

    socket.emit('join-lobby', lobby.roomID, nickname);
    io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames());
  });
}

function joinLobby(io, socket, lobbyManager) {
  socket.on('join-lobby', (nickname, lobbyCode) => {
    const lobby = lobbyManager.lobbies.get(lobbyCode);

    if (!lobby) {
      console.log('Invalid Lobby Code: ', lobbyCode);
      socket.emit('join-lobby', null, 'Anon');
      return;
    }

    const player = new Player(nickname, socket.id, lobby.roomID, false);
    lobby.addPlayer(player);
    socket.join(lobby.roomID);
    socket.player = player;

    socket.emit('join-lobby', lobby.roomID, nickname);
    io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames());
  });
}

function leaveLobby(io, socket, lobbyManager) {
  socket.on('disconnecting', () => {
    if (socket.player) {
      const roomID = socket.player.lobbyID;
      const room = io.of('/').adapter.rooms.get(roomID);
      // console.log('Room: ', room);

      if (room.size === 1) {
        console.log('Cleaning up');
        // user is the last one in the room. lobby should now be cleaned.
        lobbyManager.deleteLobby(roomID);
      }
    }
  });
}

function chatMessage(io, socket) {
  socket.on('chat message', ({ msg, playerNickname }) => {
    const roomID = socket.player.lobbyID;
    console.log(msg);
    const message = `${playerNickname}: ${msg}`;
    io.in(roomID).emit('chat message', message);
  });
}

module.exports = function exp(io, socket, lobbyManager) {
  createLobby(io, socket, lobbyManager);
  joinLobby(io, socket, lobbyManager);
  chatMessage(io, socket, lobbyManager);
  leaveLobby(io, socket, lobbyManager);
};
