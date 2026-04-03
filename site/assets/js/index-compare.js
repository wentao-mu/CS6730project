(() => {
  const DATA_FILE = "assets/data/goat_top10.json";
  const root = document.querySelector("[data-goat-compare]");

  if (!root) {
    return;
  }

  const METRICS = [
    { key: "goals", label: { en: "Goals", zh: "进球" }, unit: "" },
    { key: "assists", label: { en: "Assists", zh: "助攻" }, unit: "" },
    { key: "knockout", label: { en: "Knockout G+A", zh: "淘汰赛进球+助攻" }, unit: "" },
    { key: "titles", label: { en: "Titles", zh: "冠军数" }, unit: "" },
    { key: "appearances", label: { en: "Appearances", zh: "出场次数" }, unit: "" },
    { key: "bestxi", label: { en: "UEFA Best XI", zh: "欧足联最佳阵容" }, unit: "" },
    { key: "peak", label: { en: "Peak", zh: "巅峰" }, unit: "G+A" }
  ];

  const COPY = {
    loading: {
      en: "Loading weighted GOAT profiles.",
      zh: "正在加载加权 GOAT 画像。"
    },
    error: {
      en: "Failed to load GOAT ranking data.",
      zh: "GOAT 排名数据加载失败。"
    },
    rankLabel: {
      en: "Overall rank",
      zh: "总排名"
    },
    peakSeason: {
      en: "Peak season",
      zh: "巅峰赛季"
    },
    profileCopy: {
      en: "Radar shows metric points against the current top-10 average. Click the ranking to switch profile.",
      zh: "星图展示该球员七项得分与当前前十平均值的对比。点击右侧榜单可切换画像。"
    },
    score: {
      en: "GOAT Score",
      zh: "GOAT 得分"
    },
    points: {
      en: "pts",
      zh: "分"
    },
    weight: {
      en: "weight",
      zh: "权重"
    },
    outOfCutoff: {
      en: "Outside page cutoff",
      zh: "未进入当前榜单"
    },
    rankingValue: {
      en: "weighted score",
      zh: "加权得分"
    }
  };

  const elements = {
    starHost: root.querySelector("[data-goat-star]"),
    rankingHost: root.querySelector("[data-goat-ranking]"),
    selectedRank: root.querySelector("[data-goat-selected-rank]"),
    selectedName: root.querySelector("[data-goat-selected-name]"),
    selectedCopy: root.querySelector("[data-goat-selected-copy]"),
    selectedScore: root.querySelector("[data-goat-selected-score]"),
    metrics: root.querySelector("[data-goat-metrics]")
  };

  if (
    !elements.starHost ||
    !elements.rankingHost ||
    !elements.selectedRank ||
    !elements.selectedName ||
    !elements.selectedCopy ||
    !elements.selectedScore ||
    !elements.metrics
  ) {
    return;
  }

  let dataset = null;
  let selectedIndex = 0;

  function getLang() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function textFor(copy) {
    return copy[getLang()];
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, String(value));
    });
    return el;
  }

  function polygonPoints(cx, cy, radius, ratios) {
    const total = ratios.length;
    return ratios
      .map((ratio, idx) => {
        const angle = -Math.PI / 2 + (idx / total) * Math.PI * 2;
        const x = cx + Math.cos(angle) * radius * ratio;
        const y = cy + Math.sin(angle) * radius * ratio;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }

  function formatMetricValue(metric, metricData) {
    if (metricData.value === null || metricData.value === undefined) {
      return textFor(COPY.outOfCutoff);
    }

    if (metric.key === "peak") {
      const season = metricData.season ? ` · ${metricData.season}` : "";
      return `${metricData.value} G+A${season}`;
    }

    return `${metricData.value}${metric.unit ? ` ${metric.unit}` : ""}`;
  }

  function renderSelectedProfile() {
    const player = dataset.players[selectedIndex];
    elements.selectedRank.textContent = `${textFor(COPY.rankLabel)} #${player.overall_rank}`;
    elements.selectedName.textContent = player.name;
    const peak = player.metrics.peak;
    const peakCopy =
      peak && peak.season
        ? `${textFor(COPY.peakSeason)} ${peak.season}. ${textFor(COPY.profileCopy)}`
        : textFor(COPY.profileCopy);
    elements.selectedCopy.textContent = peakCopy;
    elements.selectedScore.textContent = player.score.toFixed(2);

    elements.metrics.innerHTML = METRICS.map((metric) => {
      const metricData = player.metrics[metric.key];
      const weight = dataset.weights[metric.key];

      return `
        <article class="compare-metric-card">
          <p class="compare-metric-card__label">${escapeHtml(metric.label[getLang()])}</p>
          <strong class="compare-metric-card__value">${escapeHtml(formatMetricValue(metric, metricData))}</strong>
          <p class="compare-metric-card__meta">
            ${metricData.points} ${escapeHtml(textFor(COPY.points))} · ${Math.round(weight * 100)}% ${escapeHtml(textFor(COPY.weight))}
          </p>
        </article>
      `;
    }).join("");
  }

  function renderRanking() {
    const maxScore = dataset.players[0]?.score || 1;

    elements.rankingHost.innerHTML = dataset.players
      .map((player, index) => {
        const active = index === selectedIndex ? " is-active" : "";
        const width = Math.max(8, (player.score / maxScore) * 100);
        return `
          <button class="compare-ranking-row${active}" type="button" data-player-index="${index}" aria-pressed="${index === selectedIndex ? "true" : "false"}">
            <div class="compare-ranking-row__header">
              <span class="compare-ranking-row__rank">#${player.overall_rank}</span>
              <span class="compare-ranking-row__name">${escapeHtml(player.name)}</span>
              <span class="compare-ranking-row__score">${player.score.toFixed(2)}</span>
            </div>
            <div class="compare-ranking-row__track">
              <span class="compare-ranking-row__fill" style="width:${width.toFixed(1)}%"></span>
            </div>
          </button>
        `;
      })
      .join("");
  }

  function renderStar() {
    const player = dataset.players[selectedIndex];
    const average = dataset.top10_average_points;
    const size = 430;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 150;

    const playerRatios = METRICS.map((metric) => player.metrics[metric.key].points / 100);
    const averageRatios = METRICS.map((metric) => average[metric.key] / 100);

    elements.starHost.innerHTML = "";
    const svg = createSvgElement("svg", {
      class: "compare-star-svg",
      viewBox: "0 0 430 430",
      role: "img",
      "aria-label":
        getLang() === "zh"
          ? `${player.name} 的前十 GOAT 星图`
          : `${player.name} top-10 GOAT radar`
    });

    for (let ring = 1; ring <= 5; ring += 1) {
      svg.appendChild(
        createSvgElement("polygon", {
          points: polygonPoints(cx, cy, radius, METRICS.map(() => ring / 5)),
          fill: "none",
          stroke: "rgba(31, 37, 49, 0.14)",
          "stroke-width": "1"
        })
      );
    }

    METRICS.forEach((metric, idx) => {
      const angle = -Math.PI / 2 + (idx / METRICS.length) * Math.PI * 2;
      const x2 = cx + Math.cos(angle) * radius;
      const y2 = cy + Math.sin(angle) * radius;
      svg.appendChild(
        createSvgElement("line", {
          x1: cx,
          y1: cy,
          x2: x2.toFixed(2),
          y2: y2.toFixed(2),
          stroke: "rgba(31, 37, 49, 0.18)",
          "stroke-width": "1"
        })
      );

      const labelX = cx + Math.cos(angle) * (radius + 26);
      const labelY = cy + Math.sin(angle) * (radius + 26);
      const text = createSvgElement("text", {
        x: labelX.toFixed(2),
        y: labelY.toFixed(2),
        fill: "#1f1f21",
        "font-size": "12",
        "font-weight": "700",
        "text-anchor": labelX < cx - 8 ? "end" : labelX > cx + 8 ? "start" : "middle",
        "dominant-baseline": "middle"
      });
      text.textContent = metric.label[getLang()];
      svg.appendChild(text);
    });

    svg.appendChild(
      createSvgElement("polygon", {
        points: polygonPoints(cx, cy, radius, averageRatios),
        fill: "rgba(166, 174, 189, 0.18)",
        stroke: "#8f99ab",
        "stroke-width": "2",
        "stroke-dasharray": "6 5"
      })
    );

    svg.appendChild(
      createSvgElement("polygon", {
        points: polygonPoints(cx, cy, radius, playerRatios),
        fill: "rgba(0, 113, 227, 0.20)",
        stroke: "#0071e3",
        "stroke-width": "2.5"
      })
    );

    elements.starHost.appendChild(svg);
  }

  function render() {
    if (!dataset) {
      return;
    }

    renderSelectedProfile();
    renderRanking();
    renderStar();
  }

  async function init() {
    elements.starHost.innerHTML = `<p class="compare-loading">${escapeHtml(textFor(COPY.loading))}</p>`;

    try {
      const response = await fetch(DATA_FILE);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      dataset = await response.json();
      render();
    } catch (error) {
      elements.starHost.innerHTML = `<p class="compare-loading">${escapeHtml(textFor(COPY.error))}</p>`;
      elements.rankingHost.innerHTML = "";
    }
  }

  elements.rankingHost.addEventListener("click", (event) => {
    const button = event.target.closest("[data-player-index]");
    if (!button) {
      return;
    }

    const nextIndex = Number(button.getAttribute("data-player-index"));
    if (!Number.isFinite(nextIndex) || !dataset || nextIndex === selectedIndex) {
      return;
    }

    selectedIndex = nextIndex;
    render();
  });

  const langToggle = document.querySelector("[data-lang-toggle]");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      window.requestAnimationFrame(render);
    });
  }

  window.addEventListener("resize", () => {
    if (dataset) {
      renderStar();
    }
  });

  init();
})();
