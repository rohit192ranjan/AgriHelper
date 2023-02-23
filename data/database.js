const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  //const client = await MongoClient.connect('mongodb://localhost:27017');
  const client = await MongoClient.connect(process.env.mongodblink, {useNewUrlParser: true});
  database = client.db('agrihelper');
}

function getDb() {
  if (!database) {
    throw { message: 'Database connection not established!' };
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb
};