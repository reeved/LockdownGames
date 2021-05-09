/* eslint-disable no-unused-vars */
const Mongo = require('../Mongo');

function getStats(io, socket) {
  socket.on('get-mongo', async () => {
    const mongo = new Mongo();
    const socketID = socket.id;
    const pokerGames = await mongo.retrieveGames('poker');
    io.in(socketID).emit('poker-stats', pokerGames);
    io.in(socketID).emit('codename-stats', 'CODENAMEDATA');
    io.in(socketID).emit('last-card-stats', 'LASCERDATA');
  });
}

function updateUser(io, socket) {
  socket.on('user-id', async ({ gameID, userID }) => {
    const mongo = new Mongo();
    const user = await mongo.getUserGames(userID);
    console.log(user);
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
  updateUser(io, socket);
};