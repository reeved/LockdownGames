class Lobby {
  constructor() {
    this.roomID = this.setRoomID();
    this.players = [];
    this.host = null;
    this.chatMessages = [];
  }

  // eslint-disable-next-line class-methods-use-this
  setRoomID() {
    const LOBBY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const LOBBY_ID_LENGTH = 6;
    let randomstring = '';

    // put a loop to select a character randomly in each iteration
    for (let i = 0; i < LOBBY_ID_LENGTH; i += 1) {
      const rnum = Math.floor(Math.random() * LOBBY_CHARS.length);
      randomstring += LOBBY_CHARS.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  // To be used when joining/creating a lobby
  addPlayer(player) {
    if (player) {
      this.players.push(player);
    }
  }

  // To be used when a player disconnects from a lobby
  removePlayer(player) {
    if (player) {
      const index = this.players.indexOf(player);
      this.players.splice(index, 1);
    }
  }

  getPlayerNicknames() {
    const playerList = [];
    this.players.forEach((p) => {
      playerList.push(p.nickname);
    });

    return playerList;
  }
}

module.exports = Lobby;
