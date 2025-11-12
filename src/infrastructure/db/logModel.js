const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

logSchema.index({ userId: 1 });
logSchema.index({ action: 1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ userId: 1, timestamp: -1 });

logSchema.plugin(mongoosePaginate);

const Log = mongoose.model('Log', logSchema);

async function ensureIndexes() {
  try {
    await Log.createIndexes();
    const indexes = await Log.collection.getIndexes();
    console.log('MongoDB indexes created:', Object.keys(indexes));
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
}

module.exports = {
  Log,
  ensureIndexes
};

