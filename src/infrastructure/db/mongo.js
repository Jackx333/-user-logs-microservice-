const mongoose = require('mongoose');

let isConnected = false;

async function connectMongo() {
  if (isConnected) {
    return;
  }

  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/logsdb';
    await mongoose.connect(mongoUrl);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

module.exports = {
  connectMongo
};

