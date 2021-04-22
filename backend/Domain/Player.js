class Player {
  constructor(nickname, socketID, lobbyID, isHost) {
    this.nickname = nickname;
    this.socketID = socketID;
    this.lobbyID = lobbyID;
    this.isHost = isHost;
  }
}

module.exports = Player;
