const fs = require("fs");
const fsp = require("fs/promises");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT) || 6730;
const HOST = process.env.HOST || "0.0.0.0";
const SITE_DIR = path.join(__dirname, "site");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : __dirname;
const STORE_FILE = path.join(DATA_DIR, "vote-store.json");

const CANDIDATES = ["ronaldo", "messi"];
const BASELINE_COUNTS = {
  ronaldo: 42,
  messi: 35
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".csv": "text/csv; charset=utf-8"
};

const sseClients = new Set();

let store = { votes: {} };

async function ensureDataDir() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
}

function normalizeStore(input) {
  const votes = {};
  const candidateValues = new Set(CANDIDATES);
  const source = input && typeof input === "object" ? input.votes : null;

  if (source && typeof source === "object") {
    Object.entries(source).forEach(([voterId, candidate]) => {
      if (isValidVoterId(voterId) && candidateValues.has(candidate)) {
        votes[voterId] = candidate;
      }
    });
  }

  return { votes };
}

async function loadStore() {
  try {
    await ensureDataDir();
    const raw = await fsp.readFile(STORE_FILE, "utf8");
    store = normalizeStore(JSON.parse(raw));
  } catch {
    store = { votes: {} };
    await saveStore();
  }
}

async function saveStore() {
  await ensureDataDir();
  await fsp.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

function isValidVoterId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,80}$/.test(value);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 32) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });
    req.on("error", reject);
  });
}

function computeTotals() {
  const totals = { ...BASELINE_COUNTS };
  Object.values(store.votes).forEach((candidate) => {
    if (candidate in totals) {
      totals[candidate] += 1;
    }
  });
  return totals;
}

function getPayload(voterId = "") {
  return {
    totals: computeTotals(),
    yourChoice: isValidVoterId(voterId) ? store.votes[voterId] || "" : "",
    totalVoters: Object.keys(store.votes).length,
    updatedAt: Date.now()
  };
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function broadcastVotes() {
  const payload = `data: ${JSON.stringify(getPayload())}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

function serveStatic(req, res, pathname) {
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const normalized = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(SITE_DIR, normalized);

  if (!filePath.startsWith(SITE_DIR)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = requestUrl;

  if (req.method === "GET" && pathname === "/api/votes") {
    const voterId = requestUrl.searchParams.get("voterId") || "";
    sendJson(res, 200, getPayload(voterId));
    return;
  }

  if (req.method === "GET" && pathname === "/healthz") {
    sendJson(res, 200, {
      ok: true,
      uptimeSeconds: Math.round(process.uptime()),
      storeFile: STORE_FILE
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/votes/stream") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform"
    });
    res.write(`data: ${JSON.stringify(getPayload())}\n\n`);
    sseClients.add(res);

    const heartbeat = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 25000);

    req.on("close", () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/vote") {
    try {
      const body = await parseJsonBody(req);
      const candidate = typeof body.candidate === "string" ? body.candidate : "";
      const voterId = typeof body.voterId === "string" ? body.voterId : "";

      if (!CANDIDATES.includes(candidate)) {
        sendJson(res, 400, { error: "Invalid candidate" });
        return;
      }

      if (!isValidVoterId(voterId)) {
        sendJson(res, 400, { error: "Invalid voter id" });
        return;
      }

      store.votes[voterId] = candidate;
      await saveStore();

      const payload = getPayload(voterId);
      sendJson(res, 200, payload);
      broadcastVotes();
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res, pathname);
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
});

loadStore().then(() => {
  server.listen(PORT, HOST, () => {
    console.log(`Realtime vote server running at http://${HOST}:${PORT}`);
  });
});
