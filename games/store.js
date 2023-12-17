import fs from 'fs';

import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@games-db:27017';
const client = new MongoClient(url);
const dbName = 'games';

let games;
const gameCollection = async () => {
  if (!games) {
    await client.connect();
    const db = client.db(dbName);
    games = db.collection('games');
  }
  return games;
}

const read = async () => {
  try{
    const collection = await gameCollection();
    const docs = await collection.find({}).toArray();
    return docs[0] || {};
  } catch (err) {
    console.log(err);
  }
}

const write = async (games) => {
  try{
    const collection = await gameCollection();
    await collection.deleteMany({});
    await collection.insertOne(games);
  } catch (err) {
    console.log(err);
  }
}
// const read = () => {
//   if (fs.existsSync('games.json')) {
//     const games = fs.readFileSync('games.json');
//     return JSON.parse(games);
//   } else {
//     return {};
//   }
// };

// const write = (games) => {
//   fs.writeFileSync('games.json', JSON.stringify(games));
// };

export default {
  read,
  write,
};
