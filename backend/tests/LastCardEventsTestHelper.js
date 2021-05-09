const Client = require('socket.io-client');

async function startLastCardGame(lobbyPlayers, port, lobbyCode) {
  return new Promise((resolve) => {
    let gamePlayers = [];
    let startingCard = null;
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Reeve`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('lastcard-new-game');
      lobbyPlayers[0].on('lastcard-new-game', (allPlayers, card) => {
        gamePlayers = allPlayers;
        startingCard = card;
        resolve({ gamePlayers, startingCard });
      });
    });
  });
}

async function playCard(lobbyPlayers, port, lobbyCode) {
  return new Promise((resolve) => {
    const cardPlayed = [];
    cardPlayed.push('2S');
    let returnedCard = null;
    let isPlayerDone = null;
    let nextPlayer = null;
    let currentPlayer = null;
    let playersState = null;
    let amount = null;
    let ace = null;
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Reeve`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('lastcard-new-game');
      lobbyPlayers[0].emit('lastcard-card-played', cardPlayed, false, 0, false);
      lobbyPlayers[0].on('lastcard-card-played', (card, playerFin, nextPlayerName, playerName, players, totalPickup, originalAce) => {
        returnedCard = card;
        isPlayerDone = playerFin;
        nextPlayer = nextPlayerName;
        currentPlayer = playerName;
        playersState = players;
        amount = totalPickup;
        ace = originalAce;
        resolve({ returnedCard, isPlayerDone, nextPlayer, currentPlayer, playersState, amount, ace });
      });
    });
  });
}

async function drawCard(lobbyPlayers, port, lobbyCode) {
  return new Promise((resolve) => {
    const amount = 2;
    let newHand = [];
    let nextPlayer = null;
    let allPlayers = null;
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Reeve`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('lastcard-new-game');
      lobbyPlayers[0].emit('lastcard-update-hand', amount);
      lobbyPlayers[0].on('lastcard-update-hand', (hand) => {
        newHand = hand;
      });
      lobbyPlayers[0].on('lastcard-change-turn', (nextPlayerName, playersState) => {
        nextPlayer = nextPlayerName;
        allPlayers = playersState;
        resolve({ newHand, nextPlayer, allPlayers });
      });
    });
  });
}

module.exports = {
  startLastCardGame,
  playCard,
  drawCard,
};
