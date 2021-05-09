/* eslint-disable no-unused-vars */
const Mongo = require('../Mongo');

function getStats(io, socket) {
  socket.on('get-mongo', async () => {
    const mongo = new Mongo();
    const socketID = socket.id;
    const pokerGames = await mongo.retrieveGames('poker');
    // const codenameGames = await mongo.retrieveGames('Codenames');
    io.in(socketID).emit('poker-stats', pokerGames);
    io.in(socketID).emit('codename-stats', 'Codename Data');
    io.in(socketID).emit('last-card-stats', 'LastCard Data');
  });
}

function updateUser(io, socket) {
  socket.on('user-id', async ({ gameID, userID }) => {
    const mongo = new Mongo();
    const user = await mongo.getUserGames(userID);
    if (!user.gameArray) {
      const gameArray = [];
      gameArray.push(gameID);
      await mongo.updateUserGames(userID, gameArray);
    } else {
      const { gameArray } = user;
      gameArray.push(gameID);
      await mongo.updateUserGames(userID, gameArray);
    }
  });
}

module.exports = function exp(io, socket) {
  getStats(io, socket);
};
