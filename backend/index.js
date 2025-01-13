import express from 'express';
import dotenv from 'dotenv';
import connectdb from './utils/database.js';
const app = express();
dotenv.config({});
const PORT = process.env.PORT;
connectdb()
  .then(() => {
    console.log('DB CONNECTED SUCCESSFULLY');
    app.listen(PORT, () => {
      console.log('SERVER IS LISTENING AT 8000');
    });
  })
  .catch(() => console.log('Error connecting DB', error));
