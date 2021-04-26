const Game = require('../Domain/Poker/Game');

let game = null;

function startGame(io, socket, lobbyManager) {
  socket.on('poker-new-game', () => {
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.getLobby(lobbyID);
    game = new Game(lobby.players);
    // startPlay(io, socket, lobbyManager);
  });
}

// function startPlay(io) {
//   const holeCards = game.generateHoleCards();
//   // eslint-disable-next-line no-restricted-syntax
//   for (const { socketID, card1, card2 } of holeCards) {
//     io.to(socketID).emit('poker-hole-cards', {
//       card1,
//       card2,
//     });
//   }
//   game.handlePlayStart();
// }

function handleFold(io, socket) {
  socket.on('poker-fold', () => {
    game.handleFold();
  });
}

// function handleCall(io, socket) {
//   socket.on('poker-call', ({ amount }) => {});
// }

// function handleRaise(io, socket) {
//   socket.on('poker-raise', ({ amount }) => {});
// }

// function disconnect(io, socket) {
//   socket.on('disconnect', (socket) => {
//     // state.reset();
//   });
// }

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function showdown(playFinished) {
//   io.to('room1').emit('poker-showdown', { result: playFinished });
//   await sleep(5000);
//   io.to('room1').emit('poker-showdown', { result: '' });
//   startPlay();
// }

module.exports = function exp(io, socket, lobbyManager) {
  startGame(io, socket, lobbyManager);
  handleFold(io, socket, lobbyManager);
  // handleCall(io, socket, lobbyManager);
  // handleRaise(io, socket, lobbyManager);
  // disconnect(io, socket, lobbyManager);
};
