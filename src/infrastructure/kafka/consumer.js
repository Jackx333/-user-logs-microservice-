const { Kafka } = require('kafkajs');
const { processLog } = require('../../application/processLog');
const { Log } = require('../db/logModel');

const kafka = new Kafka({
  clientId: 'activity-log-consumer',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

const consumer = kafka.consumer({ groupId: 'activity-log-group' });

async function startConsumer(topic) {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log('Kafka consumer connected and subscribed to:', topic);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawData = JSON.parse(message.value.toString());
          const processedLog = processLog(rawData);
          
          const logDoc = new Log(processedLog);
          await logDoc.save();
          
          console.log('Log saved to MongoDB:', processedLog.userId, processedLog.action);
        } catch (error) {
          console.error('Error processing message:', error.message);
        }
      }
    });
  } catch (error) {
    console.error('Kafka consumer error:', error.message);
    throw error;
  }
}

module.exports = {
  startConsumer
};

