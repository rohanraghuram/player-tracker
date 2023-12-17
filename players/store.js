import fs from 'fs';
import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@players-db:27017';
const client = new MongoClient(url);
const dbName = 'players';

let players;
const playerCollection = async () => {
  if (!players) {
    await client.connect();
    const db = client.db(dbName);
    players = db.collection('players');
  }
  return players;
}

const read = async () => {
  try{
    const collection = await playerCollection();
    const docs = await collection.find({}).toArray();
    return docs[0] || {};
  } catch (err) {
    console.log(err);
  }
}

const write = async (players) => {
  try{
    const collection = await playerCollection();
    await collection.deleteMany({});
    await collection.insertOne(players);
  } catch (err) {
    console.log(err);
  }
}




// const read = () => {
//   if (fs.existsSync('players.json')) {
//     const players= fs.readFileSync('players.json');
//     return JSON.parse(players);
//   } else {
//     return {};
//   }
// };

// const write = (players) => {
//   fs.writeFileSync('players.json', JSON.stringify(players));
// };

export default {
  read,
  write,
};