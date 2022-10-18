import dotenv from 'dotenv';
dotenv.config();
import { client } from './db/client.js';
import router from './api/index.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

client.connect();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
});

app.use('/api', router);

export default app;