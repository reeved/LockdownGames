const BackendServer = require('../index');
const { startLastCardGame, playCard, drawCard } = require('./LastCardEventsTestHelper');
const { createLobby, joinLobby, sendAndReceiveMessage } = require('./LobbyEventTestHelpers');
const {
  checkCodenamesDecrementScore,
  checkUpdateSelectedCodenames,
  checkCodenamesTurnChanged,
  checkCodenamesGameOver,
  checkCodenamesCreation,
} = require('./CodenamesEventTestHelpers');

describe('LobbyEvent Socket Testing', () => {
  const port = process.env.PORT || 6001;

  let lobbyPlayers = [];
  let lobbyCode = 'abd';
  let hostNickname = 'Reeve';

  // Create a new host client and creates a lobby for other clients to join in tests
  beforeEach(() => {
    console.log = jest.fn();

    return createLobby(lobbyPlayers, port).then((data) => {
      lobbyPlayers = data.returnPlayerList;
      lobbyCode = data.returnRoomID;
      hostNickname = data.returnNickname;
    });
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

  test('Creating Multiple Lobbies', () => {
    createLobby([], port);
    return createLobby([], port).then(() => {
      expect(BackendServer.lobbyManager.lobbies.size).toBe(3);
    });
  });

  test('One more Player joining Lobby', () => {
    return joinLobby(lobbyPlayers, 1, port, lobbyCode).then((data) => {
      expect(data.returnRoomID).toBeTruthy();
      expect(data.returnPlayerList).toHaveLength(2);
      expect(data.returnNickname).toBe('Reeve1');
    });
  });

  test('Five more Players joining Lobby', () => {
    for (let i = 1; i < 5; i += 1) {
      // Only run tests once all Players have been added
      joinLobby(lobbyPlayers, i, port, lobbyCode);
    }

    return joinLobby(lobbyPlayers, 5, port, lobbyCode).then((data) => {
      const { players } = BackendServer.lobbyManager.lobbies.get(lobbyCode);
      expect(data.returnRoomID).toBeTruthy();
      expect(players).toHaveLength(6);
    });
  });

  test('Lobby gets Deleted when all players have Disconnected', () => {
    function disconnect() {
      const { players } = BackendServer.lobbyManager.lobbies.get(lobbyCode);
      Object.values(players).forEach((p) => {
        const socket = BackendServer.io.sockets.sockets.get(p.socketID);
        socket.disconnect();
      });
    }

    for (let i = 1; i < 5; i += 1) {
      joinLobby(lobbyPlayers, i, port, lobbyCode);
    }

    return joinLobby(lobbyPlayers, 5, port, lobbyCode).then(() => {
      disconnect();
      const players = BackendServer.lobbyManager.lobbies.get(lobbyCode);
      // Lobby should be undefined since it gets deleted from the Lobby Manager
      expect(players).toBeUndefined();
    });
  });

  test('Sending and Receiving Chat Messages', () => {
    return sendAndReceiveMessage(lobbyPlayers, port, lobbyCode).then((message) => {
      expect(message.sender).toBe('Reeve:');
      expect(message.msg).toBe('Hello World');
    });
  });

  test('LAST CARD - Starting a Game', () => {
    return startLastCardGame(lobbyPlayers, port, lobbyCode).then((data) => {
      expect(data.gamePlayers[0].name).toBe('Reeve0');
    });
  });

  test('LAST CARD - Playing a Card', () => {
    joinLobby(lobbyPlayers, 1, port, lobbyCode);
    startLastCardGame(lobbyPlayers, port, lobbyCode);
    return playCard(lobbyPlayers, port, lobbyCode).then((data) => {
      expect(data.currentPlayer).toBe('Reeve');
      expect(data.returnedCard).toStrictEqual(['2S']);
      expect(data.nextPlayer).not.toBe('Reeve');
    });
  });
  test('LAST CARD - Drawing two Card', () => {
    joinLobby(lobbyPlayers, 1, port, lobbyCode);
    startLastCardGame(lobbyPlayers, port, lobbyCode);
    return drawCard(lobbyPlayers, port, lobbyCode).then((data) => {
      expect(data.newHand).toHaveLength(2);
      expect(data.nextPlayer).not.toBe('Reeve');
    });
  });

  test('Creating new codenames game', () => {
    return checkCodenamesCreation(lobbyPlayers, port, lobbyCode).then((results) => {
      expect(results.board).toHaveLength(24);
      // 5 users total (4 in test call + 1 on test setup - division should be 3/2 red/blue for odd number)
      expect(results.redTeam).toHaveLength(3);
      expect(results.blueTeam).toHaveLength(2);
    });
  });

  test('Game over in codenames', () => {
    return checkCodenamesGameOver(lobbyPlayers, port, lobbyCode, 'Blue').then((result) => {
      expect(result).toBe('Blue');
    });
  });

  test('Changing turn in codenames', () => {
    return checkCodenamesTurnChanged(lobbyPlayers, port, lobbyCode, 'Red').then((result) => {
      expect(result).toBe('Blue');
    });
  });

  test('Updating selected item in codenames', () => {
    return checkUpdateSelectedCodenames(lobbyPlayers, port, lobbyCode, 5).then((result) => {
      expect(result).toBe(5);
    });
  });

  test('Decrementing score in codenames', () => {
    return checkCodenamesDecrementScore(lobbyPlayers, port, lobbyCode, 'Red').then((result) => {
      expect(result).toBe('Red');
    });
  });
});
