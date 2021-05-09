const Game = require('../Domain/Poker/Game');
const GameState = require('../Domain/Poker/GameState');
const PokerRound = require('../Domain/Poker/PokerRound');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function startPlay(io, lobbyID, lobby) {
  lobby.game.createPokerRound(); // start of one 'play' a round is created
  io.in(lobbyID).emit('poker-game-state', lobby.game.gameState); // initial gameState
  const holeCards = lobby.game.distributeHoleCards(); // generates the holeCards for every player
  holeCards.forEach(({ socketID, playerName, card1, card2 }) => {
    io.in(socketID).emit('poker-hole-cards', {
      // sends it to each player accordingly
      playerName,
      holeCards: {
        card1,
        card2,
      },
    });
  });
  const pokerRound = lobby.game.handlePlayStart(); // applys blinds to the internal pokerRound
  io.in(lobbyID).emit('poker-round', pokerRound); // sends initial round state to everyone
}

function startGame(io, socket, lobbyManager) {
  socket.on('poker-new-game', () => {
    const { lobbyID } = socket.player; // lobbyID
    const lobby = lobbyManager.getLobby(lobbyID);
    lobby.game = new Game(lobby.players); // Initialises Game with Players in the lobby;
    startPlay(io, lobbyID, lobby); // starts the game. This is called whenever a 'play' is finished
  });
}

async function handlePokerAction(io, socket, lobbyManager) {
  socket.on('poker-action', async (type, amount) => {
    let newState = null;
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.getLobby(lobbyID);
    switch (type) {
      case 'fold':
        newState = await lobby.game.handleFold(); // applies the action the user makes
        break;
      case 'check':
        newState = await lobby.game.handleCheck();
        break;
      case 'call':
        newState = await lobby.game.handleCall(amount);
        break;
      case 'raise':
        newState = await lobby.game.handleRaise(amount);
        break;
      default:
        throw new Error(`Invalid Poker action: ${type}`);
    }
    if (newState instanceof PokerRound) {
      // if pokerRound then sends the new State to everybody
      io.in(lobbyID).emit('poker-round', newState);
    } else if (newState instanceof GameState) {
      // if gameState i.e pokerRound has finished, sends updated GameState
      io.in(lobbyID).emit('poker-game-state', newState);
      await delay(5000);
      // checks to see if only one person has a stack, before starting next round
      if (!lobby.game.gameState.isGameOver()) startPlay(io, lobbyID, lobby);
    } else if (newState instanceof Array) {
      // this is allIn, new State contains all the pokerRounds and the final GameState
      for (let i = 0; i < newState.length - 1; i += 1) {
        io.in(lobbyID).emit('poker-round', newState[i]);
        // eslint-disable-next-line no-await-in-loop
        await delay(3000);
      }
      // the final gameState
      io.in(lobbyID).emit('poker-game-state', newState[newState.length - 1]);
      await delay(4000);
      if (!lobby.game.gameState.isGameOver()) startPlay(io, lobbyID, lobbyID);
      // this updates the result field to say who won.
      else io.in(lobbyID).emit('poker-game-state', lobby.game.gameState);
    } else {
      throw new Error(`This should not happen ${newState}`);
    }
  });
}

module.exports = function exp(io, socket, lobbyManager) {
  startGame(io, socket, lobbyManager);
  handlePokerAction(io, socket, lobbyManager);
};
