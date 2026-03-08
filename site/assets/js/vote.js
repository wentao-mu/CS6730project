(() => {
  const CANDIDATES = ["ronaldo", "messi", "maldini", "zidane"];
  const VOTER_ID_KEY = "uefa_vote_voter_id_v1";

  const buttons = Array.from(document.querySelectorAll("[data-vote-btn]"));
  const bars = new Map(
    Array.from(document.querySelectorAll("[data-vote-bar]")).map((el) => [el.dataset.voteBar, el])
  );
  const pcts = new Map(
    Array.from(document.querySelectorAll("[data-vote-pct]")).map((el) => [el.dataset.votePct, el])
  );
  const feedback = document.querySelector("[data-vote-feedback]");

  if (buttons.length === 0 || bars.size === 0 || pcts.size === 0) {
    return;
  }

  function getLang() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function getMessages() {
    if (getLang() === "zh") {
      return {
        current: (name) => `当前你的投票：${name}（可再次点击其他人修改）`,
        updated: (name) => `投票成功：${name}`,
        failed: "实时投票连接失败，请确认服务已启动。"
      };
    }

    return {
      current: (name) => `Your current vote: ${name} (click another candidate to change)`,
      updated: (name) => `Vote submitted: ${name}`,
      failed: "Realtime vote connection failed. Make sure the server is running."
    };
  }

  function getCandidateLabel(candidate) {
    const labels = {
      en: { ronaldo: "Ronaldo", messi: "Messi", maldini: "Maldini", zidane: "Zidane" },
      zh: { ronaldo: "C罗", messi: "梅西", maldini: "马尔蒂尼", zidane: "齐达内" }
    };
    return labels[getLang()][candidate] || candidate;
  }

  function createVoterId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `voter-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function getVoterId() {
    let voterId = localStorage.getItem(VOTER_ID_KEY);
    if (!voterId) {
      voterId = createVoterId();
      localStorage.setItem(VOTER_ID_KEY, voterId);
    }
    return voterId;
  }

  function sanitizeCounts(input) {
    const out = {};
    CANDIDATES.forEach((candidate) => {
      const value = Number.parseInt(input?.[candidate], 10);
      out[candidate] = Number.isFinite(value) && value >= 0 ? value : 0;
    });
    return out;
  }

  const state = {
    voterId: getVoterId(),
    counts: sanitizeCounts({}),
    choice: ""
  };

  function renderFeedback(mode = "current") {
    if (!feedback) {
      return;
    }

    if (!state.choice) {
      feedback.textContent = "";
      return;
    }

    const messages = getMessages();
    const label = getCandidateLabel(state.choice);
    feedback.textContent = mode === "updated" ? messages.updated(label) : messages.current(label);
  }

  function render() {
    const total = CANDIDATES.reduce((sum, candidate) => sum + state.counts[candidate], 0) || 1;

    CANDIDATES.forEach((candidate) => {
      const pct = (state.counts[candidate] / total) * 100;
      const bar = bars.get(candidate);
      const pctLabel = pcts.get(candidate);
      if (bar) {
        bar.style.width = `${pct.toFixed(1)}%`;
      }
      if (pctLabel) {
        pctLabel.textContent = `${pct.toFixed(1)}%`;
      }
    });

    buttons.forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.candidate === state.choice);
    });

    renderFeedback("current");
  }

  function showError() {
    if (!feedback) {
      return;
    }
    feedback.textContent = getMessages().failed;
  }

  function applyPayload(payload, mode = "current") {
    state.counts = sanitizeCounts(payload.totals);
    if (typeof payload.yourChoice === "string" && CANDIDATES.includes(payload.yourChoice)) {
      state.choice = payload.yourChoice;
    }
    render();
    renderFeedback(mode);
  }

  async function loadVotes() {
    const response = await fetch(`/api/votes?voterId=${encodeURIComponent(state.voterId)}`);
    if (!response.ok) {
      throw new Error("Failed to load votes");
    }
    const payload = await response.json();
    applyPayload(payload, "current");
  }

  async function submitVote(candidate) {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId: state.voterId, candidate })
    });

    if (!response.ok) {
      throw new Error("Failed to submit vote");
    }

    const payload = await response.json();
    applyPayload(payload, "updated");
  }

  function bindEvents() {
    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const candidate = button.dataset.candidate || "";
        if (!CANDIDATES.includes(candidate)) {
          return;
        }
        try {
          await submitVote(candidate);
        } catch {
          showError();
        }
      });
    });

    const langToggle = document.querySelector("[data-lang-toggle]");
    if (langToggle) {
      langToggle.addEventListener("click", () => {
        window.requestAnimationFrame(render);
      });
    }
  }

  function connectStream() {
    const stream = new EventSource("/api/votes/stream");
    stream.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.totals) {
          state.counts = sanitizeCounts(payload.totals);
          render();
        }
      } catch {
        // Ignore malformed events
      }
    };

    stream.onerror = () => {
      showError();
    };
  }

  bindEvents();
  loadVotes()
    .then(connectStream)
    .catch(() => {
      showError();
    });
})();
