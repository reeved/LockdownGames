const words = require('../ServerResources/wordlist.js');
const Mongo = require('../Mongo');

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function newGame(io, socket, lobbyManager) {
  socket.on('codenames-new-game', () => {
    const roomID = socket.player.lobbyID;
    const lobby = lobbyManager.lobbies.get(roomID);
    const players = shuffle(lobby.getPlayerNicknames());
    const numWords = 24;
    const shuffledWords = shuffle(words);
    let boardWords = shuffledWords.slice(0, numWords);

    for (let i = 0; i < 24; i += 1) {
      if (i === 23) {
        boardWords[i].status = 'bomb';
      } else if (i > 16) {
        boardWords[i].status = 'unsafe';
      } else if (i > 7) {
        boardWords[i].status = 'Red';
      } else {
        boardWords[i].status = 'Blue';
      }
    }

    boardWords = shuffle(boardWords);

    const half = Math.ceil(players.length / 2);

    const redTeam = players.splice(0, half);
    const blueTeam = players.splice(-half);

    io.in(roomID).emit('codenames-new-codenames', boardWords, redTeam, blueTeam);
  });
}

function updateSelected(io, socket) {
  socket.on('codenames-update-selected', (id) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('codenames-update-selected', id);
  });
}

function decrementScore(io, socket) {
  socket.on('codenames-decrement-score', (team) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('codenames-decrement-score', team);
  });
}

function changeTurn(io, socket) {
  socket.on('codenames-change-turn', (currentTeam) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('codenames-change-turn', currentTeam === 'Red' ? 'Blue' : 'Red');
  });
}

function setGameOver(io, socket) {
  socket.on('codenames-game-over', (winningTeam) => {
    const mongo = new Mongo();
    mongo.createGame('Codenames', null, winningTeam);
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('codenames-game-over', winningTeam);
  });
}

module.exports = function exp(io, socket, lobbyManager) {
  newGame(io, socket, lobbyManager);
  decrementScore(io, socket);
  setGameOver(io, socket);
  updateSelected(io, socket);
  changeTurn(io, socket);
};
