const express = require('express');
const { publishLog } = require('../../../infrastructure/kafka/producer');
const { Log } = require('../../../infrastructure/db/logModel');

const router = express.Router();

router.post('/events', async (req, res) => {
  try {
    const topic = 'activity-logs';
    await publishLog(topic, req.body);
    res.status(201).json({ message: 'Event published successfully' });
  } catch (error) {
    console.error('Error publishing event:', error.message);
    res.status(500).json({ error: 'Failed to publish event' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId;
    const action = req.query.action;
    const from = req.query.from;
    const to = req.query.to;

    const filter = {};

    if (userId) {
      filter.userId = userId;
    }

    if (action) {
      filter.action = action;
    }

    if (from || to) {
      filter.timestamp = {};
      if (from) {
        filter.timestamp.$gte = new Date(from);
      }
      if (to) {
        filter.timestamp.$lte = new Date(to);
      }
    }

    const options = {
      page,
      limit,
      sort: { timestamp: -1 }
    };

    const result = await Log.paginate(filter, options);

    res.json({
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
      data: result.docs
    });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;

