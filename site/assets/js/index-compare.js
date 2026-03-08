(() => {
  const RONALDO_CSV = "assets/data/CR7_UCL_season_stage_wide_2003_2025.csv";
  const MESSI_CSV = "assets/data/Messi_UCL_season_stage_wide_2003_2025.csv";

  const METRICS = [
    { key: "goals_total", label: { en: "Goals", zh: "进球" }, format: (v) => `${Math.round(v)}` },
    { key: "assists_total", label: { en: "Assists", zh: "助攻" }, format: (v) => `${Math.round(v)}` },
    {
      key: "knockout_ga",
      label: { en: "Knockout G+A", zh: "淘汰赛进球+助攻" },
      format: (v) => `${Math.round(v)}`
    },
    {
      key: "pass_accuracy_avg",
      label: { en: "Pass Accuracy %", zh: "传球成功率%" },
      format: (v) => `${v.toFixed(1)}%`
    },
    { key: "titles", label: { en: "Titles", zh: "冠军数" }, format: (v) => `${Math.round(v)}` },
    {
      key: "appearances",
      label: { en: "Appearances", zh: "出场次数" },
      format: (v) => `${Math.round(v)}`
    }
  ];

  const PLAYER_BASE = {
    ronaldo: { titles: 5, appearances: 183 },
    messi: { titles: 4, appearances: 163 }
  };

  const host = document.querySelector("[data-goat-compare]");
  if (!host) {
    return;
  }

  const starHost = host.querySelector("[data-compare-star]");
  const barsHost = host.querySelector("[data-compare-bars]");
  if (!starHost || !barsHost) {
    return;
  }

  let stats = null;

  function getLang() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function parseCsvLine(line) {
    const cells = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(current);
        current = "";
      } else {
        current += ch;
      }
    }

    cells.push(current);
    return cells;
  }

  function parseCsv(text) {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      return [];
    }

    const headers = parseCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });
      return row;
    });
  }

  function num(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function computePlayerStats(rows, base) {
    let goalsTotal = 0;
    let assistsTotal = 0;
    let knockoutGoals = 0;
    let knockoutAssists = 0;
    const passAccValues = [];

    rows.forEach((row) => {
      ["group_stage", "round_of_16", "quarter_finals", "semi_finals", "final"].forEach((stage) => {
        goalsTotal += num(row[`goals_${stage}`]);
        assistsTotal += num(row[`assists_${stage}`]);

        const accValue = row[`pass_accuracy_pct_${stage}`];
        if (accValue !== "") {
          passAccValues.push(num(accValue));
        }
      });

      ["round_of_16", "quarter_finals", "semi_finals", "final"].forEach((stage) => {
        knockoutGoals += num(row[`goals_${stage}`]);
        knockoutAssists += num(row[`assists_${stage}`]);
      });
    });

    const passAccuracyAvg =
      passAccValues.length > 0
        ? passAccValues.reduce((sum, value) => sum + value, 0) / passAccValues.length
        : 0;

    return {
      goals_total: goalsTotal,
      assists_total: assistsTotal,
      knockout_ga: knockoutGoals + knockoutAssists,
      pass_accuracy_avg: passAccuracyAvg,
      titles: base.titles,
      appearances: base.appearances
    };
  }

  function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, String(value));
    });
    return el;
  }

  function getMetricValues(metric, compareStats) {
    return {
      ronaldo: compareStats.ronaldo[metric.key],
      messi: compareStats.messi[metric.key]
    };
  }

  function renderBars(compareStats) {
    const lang = getLang();
    const ronaldoName = lang === "zh" ? "C罗" : "Ronaldo";
    const messiName = lang === "zh" ? "梅西" : "Messi";

    barsHost.innerHTML = METRICS.map((metric) => {
      const values = getMetricValues(metric, compareStats);
      const maxValue = Math.max(values.ronaldo, values.messi, 1);
      const ronaldoPct = (values.ronaldo / maxValue) * 100;
      const messiPct = (values.messi / maxValue) * 100;

      return `
        <div class="compare-bar-row">
          <div class="compare-bar-row__header">
            <span class="compare-bar-row__label">${metric.label[lang]}</span>
            <span class="compare-bar-row__value">${ronaldoName} ${metric.format(values.ronaldo)} · ${messiName} ${metric.format(values.messi)}</span>
          </div>
          <div class="compare-bar-track">
            <div class="compare-bar compare-bar--ronaldo"><span style="width:${ronaldoPct.toFixed(1)}%"></span></div>
            <div class="compare-bar compare-bar--messi"><span style="width:${messiPct.toFixed(1)}%"></span></div>
          </div>
        </div>
      `;
    }).join("");
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

  function renderStar(compareStats) {
    const lang = getLang();
    const size = 420;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 145;

    const metricMax = {};
    METRICS.forEach((metric) => {
      metricMax[metric.key] = Math.max(
        compareStats.ronaldo[metric.key],
        compareStats.messi[metric.key],
        1
      );
    });

    const ronaldoRatios = METRICS.map(
      (metric) => compareStats.ronaldo[metric.key] / metricMax[metric.key]
    );
    const messiRatios = METRICS.map(
      (metric) => compareStats.messi[metric.key] / metricMax[metric.key]
    );

    starHost.innerHTML = "";
    const svg = createSvgElement("svg", {
      class: "compare-star-svg",
      viewBox: "0 0 420 420",
      role: "img",
      "aria-label":
        lang === "zh"
          ? "C罗与梅西星图对比"
          : "Ronaldo and Messi star profile comparison"
    });

    for (let ring = 1; ring <= 5; ring += 1) {
      svg.appendChild(
        createSvgElement("polygon", {
          points: polygonPoints(cx, cy, radius, METRICS.map(() => ring / 5)),
          fill: "none",
          stroke: "rgba(255,255,255,0.18)",
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
          stroke: "rgba(255,255,255,0.24)",
          "stroke-width": "1"
        })
      );

      const labelX = cx + Math.cos(angle) * (radius + 24);
      const labelY = cy + Math.sin(angle) * (radius + 24);
      const text = createSvgElement("text", {
        x: labelX.toFixed(2),
        y: labelY.toFixed(2),
        fill: "rgba(242,246,255,0.88)",
        "font-size": "12",
        "text-anchor": labelX < cx - 8 ? "end" : labelX > cx + 8 ? "start" : "middle",
        "dominant-baseline": "middle"
      });
      text.textContent = metric.label[lang];
      svg.appendChild(text);
    });

    svg.appendChild(
      createSvgElement("polygon", {
        points: polygonPoints(cx, cy, radius, ronaldoRatios),
        fill: "rgba(34, 120, 255, 0.28)",
        stroke: "#56a7ff",
        "stroke-width": "2"
      })
    );

    svg.appendChild(
      createSvgElement("polygon", {
        points: polygonPoints(cx, cy, radius, messiRatios),
        fill: "rgba(201, 35, 78, 0.25)",
        stroke: "#ff7798",
        "stroke-width": "2"
      })
    );

    starHost.appendChild(svg);
  }

  function render() {
    if (!stats) {
      return;
    }
    renderStar(stats);
    renderBars(stats);
  }

  async function init() {
    try {
      const [ronaldoText, messiText] = await Promise.all([
        fetch(RONALDO_CSV).then((response) => response.text()),
        fetch(MESSI_CSV).then((response) => response.text())
      ]);

      const ronaldoRows = parseCsv(ronaldoText);
      const messiRows = parseCsv(messiText);

      stats = {
        ronaldo: computePlayerStats(ronaldoRows, PLAYER_BASE.ronaldo),
        messi: computePlayerStats(messiRows, PLAYER_BASE.messi)
      };

      render();
    } catch (error) {
      barsHost.innerHTML =
        '<p class="compare-bar-row__value">Failed to load comparison data.</p>';
    }
  }

  const langToggle = document.querySelector("[data-lang-toggle]");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      window.requestAnimationFrame(render);
    });
  }

  window.addEventListener("resize", () => {
    if (stats) {
      renderStar(stats);
    }
  });

  init();
})();
