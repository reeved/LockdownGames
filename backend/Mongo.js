const { MongoClient } = require('mongodb');

class Mongo {
  constructor() {
    this.uri = 'mongodb+srv://Daniel:LockdownGames@lockdowngamesusers.yf5xv.mongodb.net/generala?retryWrites=true&w=majority';
    this.client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async createGame(gameName, stackTrack, winnerName) {
    try {
      await this.client.connect();
      const database = this.client.db('generala');
      const games = database.collection('games');
      const doc = {
        gameName,
        stackTrack,
        winnerName,
        date: Date(),
      };
      const result = await games.insertOne(doc);

      console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close();
    }
  }

  async retrieveGames(gameName) {
    try {
      await this.client.connect();
      const database = this.client.db('lockdowngames');
      const games = database.collection('games');

      const result = await games
        .find({
          gameName,
        })
        .toArray();
      return result;
    } finally {
      await this.client.close();
    }
  }
}

module.exports = Mongo;
