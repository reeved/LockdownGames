function newGame(io, socket) {
  socket.on('lastCard-new-game', (players) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('lastCard-new-game', players);
  });
}

function updateHand(io, socket) {
  socket.on('lastCard-update-hand', (hand) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('lastCard-update-hand', hand);
  });
}

function cardPlayed(io, socket) {
  socket.on('lastCard-card-played', (card, player) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('lastCard-card-played', card, player);
  });
}

function playerFinished(io, socket) {
  socket.on('lastCard-player-finished', (player) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('lastCard-player-finished', player);
  });
}

module.exports = function exp(io, socket) {
  newGame(io, socket);
  cardPlayed(io, socket);
  updateHand(io, socket);
  playerFinished(io, socket);
};
