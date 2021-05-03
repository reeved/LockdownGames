/* eslint-disable no-use-before-define */
const Game = require('../Domain/Poker/Game');
const GameState = require('../Domain/Poker/GameState');
const PokerRound = require('../Domain/Poker/PokerRound');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let game = null;

function startGame(io, socket, lobbyManager) {
  socket.on('poker-new-game', () => {
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.getLobby(lobbyID);
    game = new Game(lobby.players);
    startPlay(io, lobbyID);
  });
}

function startPlay(io, lobbyID) {
  game.createPokerRound();
  io.in(lobbyID).emit('poker-game-state', game.gameState);
  const holeCards = game.distributeHoleCards();
  holeCards.forEach(({ socketID, playerName, card1, card2 }) => {
    io.in(socketID).emit('poker-hole-cards', {
      playerName,
      holeCards: {
        card1,
        card2,
      },
    });
  });
  const pokerRound = game.handlePlayStart();
  io.in(lobbyID).emit('poker-round', pokerRound);
}

async function handlePokerAction(io, socket) {
  // eslint-disable-next-line no-unused-vars
  let newState = null;
  socket.on('poker-action', async (type, amount) => {
    const { lobbyID } = socket.player;

    switch (type) {
      case 'fold':
        newState = game.handleFold();
        break;
      case 'check':
        newState = game.handleCheck();
        break;
      case 'call':
        newState = game.handleCall(amount);
        break;
      case 'raise':
        newState = game.handleRaise(amount);
        break;
      default:
        throw new Error(`Invalid Poker action: ${type}`);
    }
    if (newState instanceof PokerRound) {
      io.in(lobbyID).emit('poker-round', newState);
    } else if (newState instanceof GameState) {
      io.in(lobbyID).emit('poker-game-state', newState);
      await delay(5000);
      if (!game.gameState.isGameOver()) startPlay(io, lobbyID);
    } else if (newState instanceof Array) {
      for (let i = 0; i < newState.length - 1; i += 1) {
        io.in(lobbyID).emit('poker-round', newState[i]);
        // eslint-disable-next-line no-await-in-loop
        await delay(3000);
      }
      io.in(lobbyID).emit('poker-game-state', newState[newState.length - 1]);
      await delay(5000);
      if (!game.gameState.isGameOver()) startPlay(io, lobbyID);
    } else {
      throw new Error(`This should not happen ${newState}`);
    }
  });
}

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
  handlePokerAction(io, socket);
  // disconnect(io, socket, lobbyManager);
};
