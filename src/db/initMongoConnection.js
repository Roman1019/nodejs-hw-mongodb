import 'dotenv/config';
import mongoose from 'mongoose';

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const mongoUrl = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=ClusterHw`;

function initMongoConnection() {
  return mongoose
    .connect(mongoUrl)
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
    });
}

export { initMongoConnection };
