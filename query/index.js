import express from 'express';
import cors from 'cors';
import Store from './store.js';
import logger from 'morgan';
import winston from 'winston';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Need to add comments
// Need to add winston and logging

app.get('/players', async (req, res) => {
  const players = await Store.read();
  res.send(players);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  const players = await Store.read();
  if (type === 'PlayerCreated') {
    const { id, name, club, nation, age } = data;
    let minutes = 0;
    let goals = 0;
    let assists = 0;
    players[id] = { id, name, club, nation, age, minutes, goals, assists, games: [] };
  }

  if (type === 'GameCreated') {
    const { id, team, minutes, goals, assists, playerId } = data;
    console.log(`player id = ${playerId}`);
    const player = players[playerId];
    console.log(player);
    player.games.push({ id, team, minutes, goals, assists });
    player.minutes += minutes;
    player.goals += goals;
    player.assists += assists;
  }

  await Store.write(players);

  console.log(players);

  res.send({ status: 'OK' });
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
