function createLog(data) {
  return {
    userId: data.userId,
    action: data.action,
    meta: data.meta || data.metadata || null,
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
  };
}

function validateLog(log) {
  if (!log.userId || typeof log.userId !== 'string') {
    throw new Error('userId is required and must be a string');
  }
  if (!log.action || typeof log.action !== 'string') {
    throw new Error('action is required and must be a string');
  }
  return true;
}

module.exports = {
  createLog,
  validateLog
};

