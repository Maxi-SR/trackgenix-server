/* eslint-disable no-console */
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import app from './app';

dotenv.config();
const { PORT, DATABASE_URL } = process.env;

const client = new MongoClient(DATABASE_URL);

client.connect(
  (error) => {
    if (error) {
      console.log('Fail connection to database', error);
    } else {
      console.log('Connected to database');
      app.listen(PORT, () => {
        console.log(`Server ready on port ${PORT}`);
      });
    }
  },
);
