import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import winston from 'winston';
import { randomBytes } from 'crypto';
import Store from './store.js';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

// Need to add comments
// Need to add winston and logging

app.get('/players/:id/games', async (req, res) => {
    console.log(`(${process.pid}) Games Service: GET /players/:id/games`);
    const gamesByPlayerId = await Store.read();
    res.send(gamesByPlayerId[req.params.id] || []);
});


app.post('/players/:id/games', async (req, res) => {
    console.log(`(${process.pid}) Games Service: POST /players/:id/games`);
    const { team, minutes, goals, assists } = req.body;
    const id = randomBytes(4).toString('hex');
  
    const gamesByPlayerId = await Store.read();
    const games = gamesByPlayerId[req.params.id] || [];
  
    games.push({ id, team, minutes, goals, assists });
    gamesByPlayerId[req.params.id] = games;
    await Store.write(gamesByPlayerId);
  
    try {
      await fetch('http://event-bus:4005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'GameCreated',
          data: {
            id,
            team,
            minutes,
            goals,
            assists,
            playerId: req.params.id,
          },
        }),
      });
    } catch (err) {
      console.log(`(${process.pid}) Games Service: ${err}`);
      res.status(500).send({
        status: 'ERROR',
        message: err,
      });
    }
  
    res.status(201).send(games);
});

app.post('/events', async (req, res) => {
    const event = req.body;
    const type = event.type;
  
    console.log(`(${process.pid}) Games Service Received Event: ${type}`);
  
    res.send({});
});

app.listen(4001, () => {
    console.log(`(${process.pid}) Games Service: Listening on 4001`);
  });