const BackendServer = require('../index');
const { createLobby, joinLobby, sendAndReceiveMessage } = require('./LobbyEventTestHelpers');

describe('LobbyEvent Socket Testing', () => {
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

  test('Creating Lobby', async (done) => {
    // All of these fields should be populated from the BeforeEach()
    expect(lobbyPlayers).toHaveLength(1);
    expect(hostNickname).toBe('Reeve0');
    expect(lobbyCode).toBeTruthy();
    done();
  });

  test('Creating Multiple Lobbies', (done) => {
    function callback() {
      try {
        expect(BackendServer.lobbyManager.lobbies.size).toBe(3);
        done();
      } catch (error) {
        done(error);
      }
    }

    createLobby(null, [], port);
    createLobby(callback, [], port);
  });

  test('One more Player joining Lobby', (done) => {
    function callback(data) {
      try {
        expect(data.returnRoomID).toBeTruthy();
        expect(data.returnPlayerList).toHaveLength(2);
        expect(data.returnNickname).toBe('Reeve1');
        done();
      } catch (error) {
        done(error);
      }
    }

    joinLobby(callback, lobbyPlayers, 1, port, lobbyCode);
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
  });

  test('Lobby gets Deleted when all players have Disconnected', (done) => {
    function callback() {
      try {
        const players = BackendServer.lobbyManager.lobbies.get(lobbyCode);
        // Lobby should be undefined since it gets deleted from the Lobby Manager
        expect(players).toBeUndefined();
        done();
      } catch (error) {
        done(error);
      }
    }

    function disconnect() {
      for (let i = 0; i < 6; i += 1) {
        const { socketID } = BackendServer.lobbyManager.lobbies.get(lobbyCode).players[i];
        const socket = BackendServer.io.sockets.sockets.get(socketID);
        socket.disconnect();
        // Only run tests once all sockets have been disconnected
        i === 5 && callback();
      }
    }

    for (let i = 1; i < 6; i += 1) {
      // Only disconnect sockets once all sockets have been added
      joinLobby(i === 5 ? disconnect : null, lobbyPlayers, i, port, lobbyCode);
    }
  });

  test('Sending and Receiving Chat Messages', (done) => {
    function callback(message) {
      try {
        expect(message).toBe('Reeve: Hello World');
        done();
      } catch (error) {
        done(error);
      }
    }

    sendAndReceiveMessage(callback, lobbyPlayers, port, lobbyCode);
  });
});
