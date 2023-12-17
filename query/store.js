import fs from 'fs';

import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@query-db:27017';
const client = new MongoClient(url);
const dbName = 'query';

let query;
const queryCollection = async () => {
  if (!query) {
    await client.connect();
    const db = client.db(dbName);
    query = db.collection('query');
  }
  return query;
}

const read = async () => {
  try{
    const collection = await queryCollection();
    const docs = await collection.find({}, { projection: { _id: 0 } }).toArray();
    return docs[0] || {};
  } catch (err) {
    console.log(err);
  }
}

const write = async (query) => {
  try{
    const collection = await queryCollection();
    await collection.deleteMany({});
    await collection.insertOne(query);
  } catch (err) {
    console.log(err);
  }
}


// const read = () => {
//   if (fs.existsSync('query.json')) {
//     return JSON.parse(fs.readFileSync('query.json', 'utf8'));
//   } else {
//     return {};
//   }
// };

// const write = (query) => {
//   fs.writeFileSync('query.json', JSON.stringify(query));
// };

export default {
  read,
  write,
};
