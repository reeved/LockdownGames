const Client = require('socket.io-client');

async function checkCodenamesDecrementScore(lobbyPlayers, port, lobbyCode, team) {
  return new Promise((resolve) => {
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Ben`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('codenames-decrement-score', team);
      lobbyPlayers[0].on('codenames-decrement-score', (result) => {
        resolve(result);
      });
    });
  });
}

async function checkUpdateSelectedCodenames(lobbyPlayers, port, lobbyCode, id) {
  return new Promise((resolve) => {
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Ben`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('codenames-update-selected', id);
      lobbyPlayers[0].on('codenames-update-selected', (result) => {
        resolve(result);
      });
    });
  });
}

async function checkCodenamesTurnChanged(lobbyPlayers, port, lobbyCode, team) {
  return new Promise((resolve) => {
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Ben`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('codenames-change-turn', team);
      lobbyPlayers[0].on('codenames-change-turn', (result) => {
        resolve(result);
      });
    });
  });
}

async function checkCodenamesGameOver(lobbyPlayers, port, lobbyCode, winner) {
  return new Promise((resolve) => {
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Ben`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('codenames-game-over', winner);
      lobbyPlayers[0].on('codenames-game-over', (result) => {
        resolve(result);
      });
    });
  });
}

async function checkCodenamesCreation(lobbyPlayers, port, lobbyCode) {
  return new Promise((resolve) => {
    for (let i = 1; i < 4; i += 1) {
      lobbyPlayers[i] = new Client(`http://localhost:${port}`);
      lobbyPlayers[i].on('connect', () => {
        lobbyPlayers[i].emit('join-lobby', `Ben${i.toString()}`, lobbyCode);
        lobbyPlayers[i].on('join-lobby', () => {});
      });
    }
    lobbyPlayers[0] = new Client(`http://localhost:${port}`);
    lobbyPlayers[0].on('connect', () => {
      lobbyPlayers[0].emit('join-lobby', `Ben`, lobbyCode);
      lobbyPlayers[0].on('join-lobby', () => {});
      lobbyPlayers[0].emit('codenames-new-game');
      lobbyPlayers[0].on('codenames-new-codenames', (board, redTeam, blueTeam) => {
        resolve({ board, redTeam, blueTeam });
      });
    });
  });
}

module.exports = {
  checkCodenamesDecrementScore,
  checkUpdateSelectedCodenames,
  checkCodenamesTurnChanged,
  checkCodenamesGameOver,
  checkCodenamesCreation,
};
