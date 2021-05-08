/* eslint-disable no-unused-vars */
const Client = require('socket.io-client');
const BackendServer = require('../../../index');
const { createLobby, joinLobby, sendAndReceiveMessage } = require('../../../tests/LobbyEventTestHelpers');

function emitPokerNewGame(cb, lobbyPlayers, port) {
  lobbyPlayers[0] = new Client(`http://localhost:${port}`);
  lobbyPlayers[0].on('connect', () => {
    lobbyPlayers[0].emit('poker-new-game');
    lobbyPlayers[0].on('poker-hole-cards', (data) => {
      return cb(data);
    });
  });
}

describe('poker socket tests', () => {
  const port = process.env.PORT || 6001;

  let lobbyPlayers = [];
  let lobbyCode = 'abd';
  let hostNickname = 'Reeve';

  // Create a new host client and creates a lobby for other clients to join in tests
  beforeEach((done) => {
    function callback(data) {
      try {
        lobbyPlayers = data.returnPlayerList;
        lobbyCode = data.returnRoomID;
        hostNickname = data.returnNickname;
        done();
      } catch (error) {
        done(error);
      }
    }
    createLobby(callback, lobbyPlayers, port);
  });

  // Disconnect each socket connected to the server
  afterEach((done) => {
    const { sockets } = BackendServer.io.sockets;
    sockets.forEach((socket) => {
      socket.disconnect(true);
    });
    done();
  });

  // Close the server once all tests are done
  afterAll(() => {
    BackendServer.server.close();
  });

  test('Five more Players joining Lobby', (done) => {
    function callback(data) {
      try {
        // Get the Lobby's player list from the Lobby Manager
        const { players } = BackendServer.lobbyManager.lobbies.get(lobbyCode);
        expect(data.returnRoomID).toBeTruthy();
        expect(players).toHaveLength(6);
        done();
      } catch (error) {
        done(error);
      }
    }

    for (let i = 1; i < 6; i += 1) {
      // Only run tests once all Players have been added
      joinLobby(i === 5 ? callback : null, lobbyPlayers, i, port, lobbyCode);
    }

    function callbackPoker(data) {
      expect(data).toBeTruthy();
    }
    emitPokerNewGame(callbackPoker, lobbyPlayers, port);
  });
});
