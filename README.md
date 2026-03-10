# CS6730 UEFA Greatest Debate

A web project for discussing **who is the greatest UEFA Champions League player**.

## Quick Start

### 1) Requirements
- Node.js 18+

### 2) Run
```bash
cd "/Users/carl/Downloads/CS6730 project"
node realtime-vote-server.js
```

Then open:
- http://localhost:6730

## What this starts
- Static site from `site/`
- Realtime vote API:
  - `GET /api/votes`
  - `POST /api/vote`
  - `GET /api/votes/stream` (SSE)

Votes are stored in:
- `vote-store.json`

## Optional
Use the helper script:
```bash
cd "/Users/carl/Downloads/CS6730 project"
./start-realtime.sh
```

## Stop
In terminal, press `Ctrl + C`.

## If port 6730 is already in use
```bash
cd "/Users/carl/Downloads/CS6730 project"
PORT=6740 node realtime-vote-server.js
```
Then open `http://localhost:6740`.
