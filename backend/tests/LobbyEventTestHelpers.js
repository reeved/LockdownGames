const Client = require('socket.io-client');
// const LobbyEvents = require('../Events/LobbyEvents');

/**
 * Host connects and creates lobby
 * @param {*} cb Callback function used for testing
 * @param {*} lobbyPlayers lobbyPlayers used for each test
 * @param {*} port Port the client socket will run on
 * @returns Promise reslvong and returning the lobby code
 */

async function createLobby(lobbyPlayers, port) {
  return new Promise((resolve) => {
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
        resolve({ returnRoomID, returnNickname, returnPlayerList });
      });
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

async function joinLobby(lobbyPlayers, index, port, lobbyCode) {
  return new Promise((resolve) => {
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
        resolve({ returnRoomID, returnNickname, returnPlayerList });
      });
    });
  });
}

async function sendAndReceiveMessage(lobbyPlayers, port, lobbyCode) {
  return new Promise((resolve) => {
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Reeve`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('chat-message', { msg: 'Hello World', playerNickname: 'Reeve' });
      lobbyPlayers[0].on('chat-message', (message) => {
        resolve(message);
      });
    });
  });
}

module.exports = {
  createLobby,
  joinLobby,
  sendAndReceiveMessage,
};
