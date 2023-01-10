/* eslint-disable no-console */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();
const { PORT, DATABASE_URL } = process.env;

mongoose.connect(
  DATABASE_URL,
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
