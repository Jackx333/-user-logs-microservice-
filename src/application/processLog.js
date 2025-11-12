const { createLog, validateLog } = require('../domain/log');

function processLog(rawData) {
  try {
    const log = createLog(rawData);
    validateLog(log);
    return {
      userId: log.userId,
      action: log.action,
      meta: log.meta,
      timestamp: log.timestamp
    };
  } catch (error) {
    throw new Error(`Log processing failed: ${error.message}`);
  }
}

module.exports = {
  processLog
};

