import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import json  from 'body-parser';
import router from './global-router';
import connectDb from './db';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { logger } from './logger';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

connectDb();

const app = express();
const server = createServer(app); // Use http.createServer instead of app.listen
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(json());
app.use(cookieParser());
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', router);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('listen', ({ userId, song }) => {
    console.log("HAHAHAHAHA")
    io.emit('user-listening', { userId, song });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
server.listen(8000, () => {
  console.log('Server running on port 8000');
});
