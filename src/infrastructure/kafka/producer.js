const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'activity-log-producer',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

const producer = kafka.producer();

async function connectProducer() {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Kafka producer connection error:', error.message);
    throw error;
  }
}

async function publishLog(topic, data) {
  try {
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify(data)
      }]
    });
    console.log('Log published to Kafka:', topic);
  } catch (error) {
    console.error('Error publishing to Kafka:', error.message);
    throw error;
  }
}

module.exports = {
  connectProducer,
  publishLog
};

