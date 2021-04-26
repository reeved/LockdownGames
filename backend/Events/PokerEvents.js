const Game = require('../Domain/Poker/Game');

let game = null;

function startGame(io, socket, lobbyManager) {
  socket.on('poker-new-game', () => {
    const lobbyID = socket.player.lobbyID;
    lobby = lobbyManager.getLobby(lobbyID);
    game = new Game(lobby.players);
    // startPlay(io, socket, lobbyManager);
  });
}

function startPlay(io, socket, lobbyManager) {
  let holeCards = game.generateHoleCards();
  for (let { socketID, card1, card2 } of holeCards) {
    io.to(socketID).emit('poker-hole-cards', {
      card1: card1,
      card2: card2,
    });
  }
  let pokerRound = game.handlePlayStart();
}

function handleFold(io, socket) {
  socket.on('poker-fold', () => {});
}

function handleCall(io, socket) {
  socket.on('poker-call', ({ amount }) => {});
}

function handleRaise(io, socket) {
  socket.on('poker-raise', ({ amount }) => {});
}

function disconnect(io, socket) {
  socket.on('disconnect', (socket) => {
    //state.reset();
  });
}

async function allIn() {
  let { boardArray, message } = state.handleAllIn();
  console.log(boardArray[0]);
  for (let i = 0; i < 3; i++) {
    await sleep(5000);
    setTimeout(function () {
      state.getUserState().board = boardArray[i];
      io.to('room1').emit('poker-all-in', state.getUserState());
    });
  }
  io.to('room1').emit('poker-showdown', {
    result: message,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function showdown(playFinished) {
  io.to('room1').emit('poker-showdown', { result: playFinished });
  await sleep(5000);
  io.to('room1').emit('poker-showdown', { result: '' });
  startPlay();
}

module.exports = function (io, socket, lobbyManager) {
  startGame(io, socket, lobbyManager);
  handleFold(io, socket, lobbyManager);
  handleCall(io, socket, lobbyManager);
  handleRaise(io, socket, lobbyManager);
  disconnect(io, socket, lobbyManager);
};
