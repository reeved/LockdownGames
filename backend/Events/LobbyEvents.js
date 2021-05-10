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

    socket.emit('join-lobby', lobby.roomID, nickname, lobby.chosenGame);
    io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames(), true);
  });
}

function joinLobby(io, socket, lobbyManager) {
  socket.on('join-lobby', (nickname, lobbyCode) => {
    const lobby = lobbyManager.lobbies.get(lobbyCode);

    if (!lobby) {
      socket.emit('join-lobby', 1, 'Anon');
      return;
    }

    if (lobby.players.length === lobby.maxSize) {
      socket.emit('join-lobby', 2, 'Anon');
      return;
    }

    if (lobby.hasStarted) {
      socket.emit('join-lobby', 3, 'Anon');
      return;
    }

    if (lobby.checkPlayerNicknames(nickname)) {
      socket.emit('join-lobby', 4, 'Anon');
      return;
    }
    const player = new Player(nickname, socket.id, lobby.roomID, false);
    lobby.addPlayer(player);
    socket.join(lobby.roomID);
    socket.player = player;

    socket.emit('join-lobby', lobby.roomID, nickname, lobby.chosenGame);
    io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames());
  });
}

function leaveLobby(io, socket, lobbyManager) {
  socket.on('disconnecting', () => {
    if (socket.player) {
      const roomID = socket.player.lobbyID;
      const room = io.of('/').adapter.rooms.get(roomID);

      if (room.size === 1) {
        console.log('Cleaning up Lobby');
        // user is the last one in the room. lobby should now be cleaned.
        lobbyManager.deleteLobby(roomID);
      } else {
        // remove player from lobby playerlist
        const lobby = lobbyManager.lobbies.get(roomID);
        lobby.removePlayer(socket.player);
        io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames());
      }
    }
  });
}

function chatMessage(io, socket) {
  socket.on('chat-message', ({ msg, playerNickname }) => {
    const roomID = socket.player.lobbyID;
    const message = { sender: `${playerNickname}:`, msg };
    io.in(roomID).emit('chat-message', message);
  });
}

function selectGame(io, socket, lobbyManager) {
  socket.on('selected-game', (hasStarted, chosenGame) => {
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.lobbies.get(lobbyID);
    lobby.updateLobbySize(chosenGame);

    if (hasStarted) {
      lobby.setStarted();
    }

    io.in(lobbyID).emit('selected-game', hasStarted, chosenGame);
  });
}

module.exports = function exp(io, socket, lobbyManager) {
  createLobby(io, socket, lobbyManager);
  joinLobby(io, socket, lobbyManager);
  chatMessage(io, socket, lobbyManager);
  leaveLobby(io, socket, lobbyManager);
  selectGame(io, socket, lobbyManager);
};
