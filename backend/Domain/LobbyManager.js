const Lobby = require('./Lobby');

class LobbyManager {
  constructor() {
    this.lobbies = new Map();
  }

  createLobby() {
    let lobby = null;

    // Generate a new lobby by making sure the lobbyID is unique
    while (!lobby) {
      lobby = new Lobby();

      if (this.lobbies.has(lobby.roomID)) {
        lobby = null;
      }
    }

    // Save the newly created unique lobby
    this.lobbies.set(lobby.roomID, lobby);

    return lobby;
  }

  getLobby(lobbyID) {
    return this.lobbies.get(lobbyID);
  }

  deleteLobby(lobbyID) {
    // deletes lobby from Map so that the ID can be reallocated in the future
    this.lobbies.delete(lobbyID);
  }
}
module.exports = LobbyManager;
