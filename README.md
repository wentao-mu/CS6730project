# UEFA Greatest Debate

An interactive UEFA Champions League debate site built for CS6730.

The project asks a simple question: who is the greatest UEFA player of all time? Instead of relying only on opinion, the site combines seven Champions League metrics into a ranking-based `UEFA GOAT Score`, then lets visitors explore the evidence page by page.

Live site: [https://uefa-greatest-debate.onrender.com/](https://uefa-greatest-debate.onrender.com/)

## Project Overview

This site mixes editorial storytelling, metric dashboards, and lightweight data interaction:

- A homepage that introduces the debate, explains the scoring formula, and shows the current top-10 weighted ranking.
- Metric pages for `Goals`, `Assists`, `Titles Won`, `Knockout G+A`, `Appearances`, `UEFA Best XI`, and `Peak`.
- A `Peak` page that ranks the highest single-season `Goals + Assists` totals and opens a detailed player view with tables and a heatmap.
- A `Knockout` page with advanced head-to-head interaction, including stage filters, chart mode switching, zoom, and heatmap views.
- Two player profile pages for Ronaldo and Messi.
- A realtime vote module that lets visitors vote between Ronaldo and Messi and updates the page live with Server-Sent Events.

## UEFA GOAT Score

The site uses a ranking-based point system rather than raw-value normalization.

For each metric:

```text
S = max(105 - 5r, 0)
```

Where:

- `S` is the score for one metric
- `r` is the player's rank in that metric
- rank `#1` gets `100`
- each lower place loses `5` points
- scores do not go below `0`

The final weighted score is:

```text
U = 0.25G + 0.15A + 0.20K + 0.15T + 0.10P + 0.10B + 0.05H
```

Where:

- `G` = Goals
- `A` = Assists
- `K` = Knockout G+A
- `T` = Titles
- `P` = Appearances
- `B` = UEFA Best XI
- `H` = Peak

## Pages

- `site/index.html`: homepage, scoring explanation, top-10 comparison, vote module
- `site/goals.html`: goals leaderboard and Ronaldo/Messi comparison
- `site/assists.html`: assists leaderboard and comparison
- `site/trophies.html`: titles comparison
- `site/knockout.html`: interactive knockout-stage comparison view
- `site/appearances.html`: appearances comparison
- `site/bestxi.html`: UEFA Best XI comparison
- `site/peak.html`: all-player peak-season ranking with detailed drill-down
- `site/ronaldo.html`: Ronaldo profile
- `site/messi.html`: Messi profile

## Tech Stack

- Static frontend: HTML, CSS, vanilla JavaScript
- Local/backend server: Node.js `http` server
- Realtime updates: Server-Sent Events
- Deployment: Render Web Service
- Data files: CSV and JSON stored in `site/assets/data/`

## Repository Structure

```text
site/
  assets/
    css/
    data/
    js/
    logos/
    media/
scripts/
  build_goat_top10.py
  fetch_ucl_peak_seasons.py
realtime-vote-server.js
render.yaml
package.json
```

Key files:

- `realtime-vote-server.js`: serves the site, vote API, SSE stream, and health check
- `site/assets/js/index-compare.js`: renders the homepage top-10 comparison
- `site/assets/js/knockout-headtohead.js`: knockout chart, zoom, and heatmap interactions
- `site/assets/js/peak-season.js`: all-player peak-season ranking and player drill-down
- `scripts/build_goat_top10.py`: generates `site/assets/data/goat_top10.json`
- `scripts/fetch_ucl_peak_seasons.py`: generates the all-player peak-season CSV

## Local Development

### Requirements

- Node.js 18 or newer

### Run the site

```bash
npm install
npm start
```

Default local URL:

```text
http://localhost:6730
```

### Useful endpoints

- `GET /`
- `GET /healthz`
- `GET /api/votes`
- `POST /api/vote`
- `GET /api/votes/stream`

### Change the port

```bash
PORT=6740 npm start
```

## Vote System

The live vote module currently supports only two candidates:

- `ronaldo`
- `messi`

Votes are stored in:

```text
vote-store.json
```

Baseline counts are seeded in the server so the public chart does not start from zero.

## Data Generation

### Rebuild the top-10 GOAT ranking JSON

```bash
python3 scripts/build_goat_top10.py
```

This generates:

```text
site/assets/data/goat_top10.json
```

### Rebuild the all-player peak-season dataset

```bash
python3 scripts/fetch_ucl_peak_seasons.py
```

This generates:

```text
site/assets/data/ucl_player_season_totals_2003_2025.csv
```

## Deploying on Render

This repository is already configured for Render.

### Blueprint deploy

1. Push the repository to GitHub.
2. In Render, create a new `Blueprint`.
3. Connect the repository.
4. Render reads `render.yaml` and provisions the web service.

### Current Render configuration

- Runtime: `node`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/healthz`
- Region: `virginia`
- Plan: `free`

### Manual CLI deploy

Once the Render CLI is logged in and the workspace is set:

```bash
render deploys create srv-d77c5f94tr6s739h6jmg --commit <git-sha> --wait
```

## Persistence Note

On Render free instances, local file storage is ephemeral. That means:

- vote data can reset after a restart or redeploy
- the site itself is fine for class demo and presentation
- persistent voting would require external storage or a persistent disk

## License / Usage

This repository is a course project and presentation artifact for CS6730.
