const Client = require('socket.io-client');

/**
 * Host connects and creates lobby
 * @param {*} cb Callback function used for testing
 * @param {*} lobbyPlayers lobbyPlayers used for each test
 * @param {*} port Port the client socket will run on
 * @returns Promise reslvong and returning the lobby code
 */

function createLobby(cb, lobbyPlayers, port) {
  let returnRoomID = null;
  let returnNickname = null;
  let returnPlayerList = [];

  lobbyPlayers[0] = new Client(`http://localhost:${port}`);
  lobbyPlayers[0].on('connect', () => {
    lobbyPlayers[0].emit('create-lobby', 'Reeve0');
    lobbyPlayers[0].on('join-lobby', (roomID, nickname) => {
      returnRoomID = roomID;
      returnNickname = nickname;
    });
    lobbyPlayers[0].on('update-players', (playerList) => {
      returnPlayerList = playerList;
      return cb ? cb({ returnRoomID, returnNickname, returnPlayerList }) : { returnRoomID, returnNickname, returnPlayerList };
    });
  });
}
/**
 * Connects and joins 6 players to lobby
 * @param {*} cb Callback function used for testing
 * @param {*} lobbyPlayers lobbyPlayers used for each test
 * @param {*} index The index of lobbyPlayers array
 * @param {*} port Port the client socket will run on
 * @param {*} lobbyCode The lobby code of the room
 * @returns a room ID, a nickname, as well as the updated lobby Player list
 */

function joinLobby(cb, lobbyPlayers, index, port, lobbyCode) {
  let returnRoomID = null;
  let returnNickname = null;
  let returnPlayerList = [];

  lobbyPlayers[index] = new Client(`http://localhost:${port}`);
  lobbyPlayers[index].on('connect', () => {
    lobbyPlayers[index].emit('join-lobby', `Reeve${index.toString()}`, lobbyCode);
    lobbyPlayers[index].on('join-lobby', (roomID, nickname) => {
      returnRoomID = roomID;
      returnNickname = nickname;
    });
    lobbyPlayers[index].on('update-players', (playerList) => {
      returnPlayerList = playerList;
      return cb ? cb({ returnRoomID, returnNickname, returnPlayerList }) : { returnRoomID, returnNickname, returnPlayerList };
    });
  });
}

function sendAndReceiveMessage(cb, lobbyPlayers, port, lobbyCode) {
  lobbyPlayers[0] = new Client(`http://localhost:${port}`);
  lobbyPlayers[0].on('connect', () => {
    lobbyPlayers[0].emit('join-lobby', `Reeve`, lobbyCode);
    lobbyPlayers[0].on('join-lobby', () => {});
    lobbyPlayers[0].emit('chat-message', { msg: 'Hello World', playerNickname: 'Reeve' });
    lobbyPlayers[0].on('chat-message', (message) => {
      return cb ? cb(message) : message;
    });
  });
}

module.exports = {
  createLobby,
  joinLobby,
  sendAndReceiveMessage,
};
