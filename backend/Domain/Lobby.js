class Lobby {
  constructor() {
    this.roomID = this.setRoomID();
    this.players = [];
    this.host = null;
    this.chatMessages = [];
  }

  setRoomID() {
    const LOBBY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const LOBBY_ID_LENGTH = 6;
    var randomstring = '';

    //put a loop to select a character randomly in each iteration
    for (var i = 0; i < LOBBY_ID_LENGTH; i++) {
      var rnum = Math.floor(Math.random() * LOBBY_CHARS.length);
      randomstring += LOBBY_CHARS.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  //To be used when joining/creating a lobby
  addPlayer(player) {
    if (player) {
      this.players.push(player);
    }
  }

  //To be used when a player disconnects from a lobby
  removePlayer(player) {
    if (player) {
      const index = players.indexOf(player);
      this.players.splice(index, 1);
    }
  }

  getPlayerNicknames() {
    let playerList = [];
    this.players.forEach((p) => {
      playerList.push(p.nickname);
    });

    return playerList;
  }
}

module.exports = Lobby;
