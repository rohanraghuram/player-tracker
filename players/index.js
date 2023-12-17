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
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${process.pid}] ${level}: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

app.get('/players', async (req, res) => {
    try{
      console.log(`(${process.pid}) Players Service: GET /players`);
      logger.info("Reading player database");
      const players = await Store.read();
      console.log(`(${process.pid}) Players Service: ${JSON.stringify(players)}`);
      logger.info("Player details retreived");
      res.send(players);
    }
    catch{
      logger.error("Error while reading players from database");
      return res.status(500).json({"error": "Internal Server Error"});
    }
});

app.post('/players', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { name, club, nation, age } = req.body;

    if (!name){
      logger.error("Empty name provided while adding player");
      return res.status(400).json({"error": "Must include atleast a player name before adding a player"});
    }
  
    logger.info("Reading player database");
    const players = await Store.read();
    console.log(`(${process.pid}) Players Service: ${JSON.stringify(players)}`);

    players[id] = { id, name, club, nation, age };
    logger.info("Writing to player database");
    await Store.write(players);
  
    try {
      await fetch('http://event-bus:4005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PlayerCreated',
          data: {
            id,
            name,
            club,
            nation,
            age
          },
        }),
      });
    } catch (err) {
      console.log(`(${process.pid}) Players Service: ${err}`);
      logger.error("Error while sending POST request to event bus");
      res.status(500).send({
        status: 'ERROR',
        message: err,
      });
    }
  
    res.status(201).send(players[id]);
    console.log(`(${process.pid}) Players Service: ${JSON.stringify(players)}`);
});


app.post('/events', async (req, res) => {
    const event = req.body;
    const type = event.type;
    console.log(`(${process.pid}) Players Service Received Event: ${type}`);
    res.send({});
});

app.listen(4000, () => {
    console.log(`(${process.pid}) Players Service: Listening on 4000`);
});
  