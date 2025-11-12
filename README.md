# Activity Log Service

Simple microservice for handling user activity logs. Events go through Kafka, get processed, and stored in MongoDB.

## What You Need

- Node.js 18 or higher
- Docker and Docker Compose

## Installation

First, install the npm packages:

```bash
npm install
```

That's it for the app itself. Everything else runs in Docker.

## Running the Service

Start everything with Docker Compose:

```bash
docker compose up -d
```

This starts:
- Zookeeper (for Kafka)
- Kafka (message broker)
- MongoDB (database)
- The app (port 3000)

Give it about 30 seconds for everything to come up. You can check if it's ready:

```bash
curl http://localhost:3000/health
```

If you see `{"status":"ok"}`, you're good to go.

## Testing It Out

Send an event:

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","action":"login","metadata":{"ip":"127.0.0.1"},"timestamp":"2025-01-01T10:00:00Z"}'
```

Wait a couple seconds, then fetch it:

```bash
curl "http://localhost:3000/logs?userId=u1&limit=5&page=1"
```

## API Endpoints

**POST /events** - Publish an event to Kafka

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","action":"login","metadata":{"ip":"127.0.0.1"},"timestamp":"2025-01-01T10:00:00Z"}'
```

**GET /logs** - Get logs with filters

Query params:
- `page` - page number (default: 1)
- `limit` - items per page (default: 10)
- `userId` - filter by user
- `action` - filter by action type
- `from` - start date (ISO format)
- `to` - end date (ISO format)

Examples:

```bash
# Get logs for a user
curl "http://localhost:3000/logs?userId=u1&limit=5&page=1"

# Filter by action and date range
curl "http://localhost:3000/logs?action=login&from=2024-01-01T00:00:00Z&to=2030-01-01T00:00:00Z"
```

**GET /health** - Check if service is running

```bash
curl http://localhost:3000/health
```

## Useful Commands

View app logs:
```bash
docker compose logs -f app
```

Stop everything:
```bash
docker compose down
```

Restart just the app:
```bash
docker compose restart app
```

Check MongoDB indexes:
```bash
docker compose exec mongodb mongosh logsdb --eval "db.logs.getIndexes()"
```

## Project Structure

```
src/
  domain/          - log entity and validation
  application/     - business logic
  infrastructure/ - database and kafka connections
  interfaces/      - HTTP routes
  server.js        - app entry point
```

## Kubernetes

There are basic k8s manifests in the `k8s/` folder. You'll need to:
1. Build and push your Docker image
2. Update the deployment with your image name and external Kafka/MongoDB URLs
3. Apply the manifests

Note: Kafka and MongoDB need to be set up separately or use external services.

## How It Works

1. Event comes in via POST /events
2. Gets published to Kafka topic `activity-logs`
3. Consumer picks it up, validates it
4. Saves to MongoDB with indexes on userId, action, and timestamp
5. Query via GET /logs with pagination and filters

The MongoDB indexes help with fast queries, especially when filtering by userId and timestamp together.
