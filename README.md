# CS6730 UEFA Greatest Debate

A web project for discussing **who is the greatest UEFA Champions League player**.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/wentao-mu/CS6730project)

## Deploy on Render

This repository is ready to deploy as a Render Web Service.

### Option 1) Blueprint deploy
1. Push this repo to GitHub.
2. In Render, create a new `Blueprint`.
3. Point Render at this repository.
4. Render will read [`render.yaml`](render.yaml) and create the service automatically.

### Option 2) Manual Web Service deploy
Use these settings in Render:

- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/healthz`

After deployment, Render will assign a public `onrender.com` URL that you can submit in Canvas.

### Vote storage on Render
- On the free plan, vote data is ephemeral and may reset after a restart or redeploy.
- If you want votes to persist, attach a Render persistent disk on a paid plan and set `DATA_DIR` to the disk mount path such as `/var/data`.

## Quick Start

### 1) Requirements
- Node.js 18+

### 2) Run
```bash
cd "/Users/carl/codex project/CS6730 project"
npm start
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
cd "/Users/carl/codex project/CS6730 project"
./start-realtime.sh
```

## Stop
In terminal, press `Ctrl + C`.

## If port 6730 is already in use
```bash
cd "/Users/carl/codex project/CS6730 project"
PORT=6740 npm start
```
Then open `http://localhost:6740`.
