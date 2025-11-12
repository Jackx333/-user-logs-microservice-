require('dotenv').config();
const express = require('express');
const { connectMongo } = require('./infrastructure/db/mongo');
const { ensureIndexes } = require('./infrastructure/db/logModel');
const { connectProducer } = require('./infrastructure/kafka/producer');
const { startConsumer } = require('./infrastructure/kafka/consumer');
const logRoutes = require('./interfaces/http/routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', logRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await connectMongo();
    await ensureIndexes();
    await connectProducer();
    await startConsumer('activity-logs');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();

