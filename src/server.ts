import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import json  from 'body-parser';
import router from './global-router';
import connectDb from './db';

import cookieParser from 'cookie-parser';

import bodyParser from 'body-parser';
import {logger} from './logger'



dotenv.config();

connectDb();

const app = express();
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





app.listen(8000, () => {
    console.log('Server running on port 8000');
});

