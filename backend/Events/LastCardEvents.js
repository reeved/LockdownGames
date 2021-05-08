const Game = require('../Domain/lastCard/Game');

// const Deck = require('../Domain/Poker/Deck');

function newLastCardGame(io, socket, lobbyManager) {
  socket.on('lastcard-new-game', () => {
    // eslint-disable-next-line no-console
    console.log('BACKEND START GAME');
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.getLobby(lobbyID);
    lobby.game = new Game(lobby.players);
    lobby.players.forEach((element) => {
      io.in(element.socketID).emit('lastcard-update-hand', lobby.game.deck.getLastCardHand());
    });
    // io.in(lobbyID).emit('lastcard-new-game', lobby.game.players, lobby.game.deck.getACard());
    io.in(lobbyID).emit('lastcard-new-game', lobby.game.players, lobby.game.deck.getACard().toString());
  });
}

function drawCard(io, socket, lobbyManager) {
  socket.on('lastcard-update-hand', (amount) => {
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.getLobby(lobbyID);
    let deck = lobby.game.getDeck();
    const discard = lobby.game.getDiscard();

    if (deck.getSize() === 0) {
      deck = lobby.game.startNewDeck();
    }
    const { socketID } = socket.player;
    const hand = [];
    const direction = lobby.game.getDirection();

    // const lobbyIndex = lobby.players.findIndex((x) => x.nickname === socket.player.nickname);

    const indexOfCurrentPlayer = lobby.game.players.findIndex((p) => p.name === socket.player.nickname);
    const len = lobby.players.length;
    let nextPlayer = lobby.game.players[(((indexOfCurrentPlayer + direction) % len) + len) % len];

    let count = 1;
    while (!nextPlayer.isPlaying && nextPlayer.name !== socket.player.nickname) {
      // check if the next player is finsihed
      nextPlayer = lobby.game.players[(((indexOfCurrentPlayer + direction + count) % len) + len) % len];
      count += 1;

      console.log(lobby.players.length);
      if (count > lobby.players.length) {
        newLastCardGame(io, socket, lobbyManager);
      }
    }
    let amountPickedup = 0;

    for (let i = 0; i < amount; i += 1) {
      if (deck.getSize() !== 0 || discard.getSize() !== 0) {
        deck.getSize() !== 0 ? hand.push(deck.getACard()) : hand.push(discard.getACard());
        amountPickedup += 1;
      }
    }
    lobby.game.players[indexOfCurrentPlayer].handSize += amountPickedup;
    io.in(socketID).emit('lastcard-update-hand', hand);
    io.in(lobbyID).emit('lastcard-change-turn', nextPlayer.name, lobby.game.players);
  });
}

// eslint-disable-next-line no-unused-vars
function playCard(io, socket, lobbyManager) {
  socket.on('lastcard-card-played', (card, isDone, powerLevel, originalAce) => {
    let totalPickup = powerLevel;
    let playerFin = isDone;
    const { lobbyID } = socket.player;
    const lobby = lobbyManager.getLobby(lobbyID);
    let lobbyIndex = lobby.players.findIndex((x) => x.nickname === socket.player.nickname);
    const gameIndex = lobby.game.players.findIndex((p) => p.name === socket.player.nickname);
    lobby.game.players[gameIndex].handSize -= card.length;

    if (originalAce) {
      lobby.game.discard.addCard(originalAce);
    } else {
      card.forEach((element) => {
        lobby.game.discard.addCard(element);
      });
    }

    let direction = lobby.game.getDirection();
    // eslint-disable-next-line default-case
    switch (card[0].slice(0, -1)) {
      case '5': {
        totalPickup += 5 * card.length;
        break;
      }

      case '10': {
        lobbyIndex += card.length * direction;
        break;
      }

      case 'J': {
        if (card.length % 2 === 1) {
          lobby.game.getDirection() === 1 ? (direction -= 2) : (direction += 2);
          lobby.game.switchDirection();
        }
        break;
      }

      case '2': {
        totalPickup += 2 * card.length;

        break;
      }
    }
    // some janky math because javascript doesn't know how to mod properly
    const x = lobby.players.length;
    let nextPlayer = lobby.game.players[(((lobbyIndex + direction) % x) + x) % x];
    console.log('First next player: ', nextPlayer);
    let count = 0;
    console.log('Names', nextPlayer.name, socket.player.nickname, nextPlayer.name !== socket.player.nickname);

    while (!nextPlayer.isPlaying && nextPlayer.name !== socket.player.nickname) {
      // check if the next player is finsihed
      console.log(socket.player.nickname, nextPlayer.name);
      nextPlayer = lobby.game.players[(((lobbyIndex + direction + count) % x) + x) % x];
      count += 1;

      console.log(lobby.players.length, count);
      if (count > lobby.players.length) {
        console.log('NEW GAME STARTED AHHHHHHHHHHHHHHHHHHH');
        newLastCardGame(io, socket, lobbyManager);
      }
    }
    console.log('Checked next player: ', nextPlayer);
    // console.log(lobby.game.players);
    if (card.slice(0, -1) !== '5' && card.slice(0, -1) !== '2' && lobby.game.players[gameIndex].handSize === 0) {
      playerFin = false;
      lobby.game.players[gameIndex].isPlaying = false;
    }
    io.in(lobbyID).emit(
      'lastcard-card-played',
      card,
      playerFin,
      nextPlayer.name,
      socket.player.nickname,
      lobby.game.players,
      totalPickup,
      originalAce
    );
  });
}

function playerFinished(io, socket) {
  socket.on('lastcard-player-finished', (player) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('lastcard-player-finished', player);
  });
}

module.exports = function exp(io, socket, lobbyManager) {
  newLastCardGame(io, socket, lobbyManager);
  playCard(io, socket, lobbyManager);
  drawCard(io, socket, lobbyManager);
  playerFinished(io, socket, lobbyManager);
};
