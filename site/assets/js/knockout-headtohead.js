(() => {
  const root = document.querySelector("[data-knockout-app]");
  if (!root) {
    return;
  }

  const d3 = window.d3 || null;
  const RONALDO_CSV = "assets/data/CR7_UCL_season_stage_wide_2003_2025.csv";
  const MESSI_CSV = "assets/data/Messi_UCL_season_stage_wide_2003_2025.csv";
  const STAGE_KEYS = ["round_of_16", "quarter_finals", "semi_finals", "final"];

  const STAGES = [
    { key: "all", label: { en: "All knockout rounds", zh: "全部淘汰赛" } },
    { key: "round_of_16", label: { en: "Round of 16", zh: "16强" } },
    { key: "quarter_finals", label: { en: "Quarter-finals", zh: "四分之一决赛" } },
    { key: "semi_finals", label: { en: "Semi-finals", zh: "半决赛" } },
    { key: "final", label: { en: "Final", zh: "决赛" } }
  ];

  const METRICS = [
    { key: "ga", label: { en: "Goals + Assists", zh: "进球 + 助攻" } },
    { key: "goals", label: { en: "Goals", zh: "进球" } },
    { key: "assists", label: { en: "Assists", zh: "助攻" } }
  ];

  const CHART_MODES = [
    { key: "season", label: { en: "Season values", zh: "单赛季值" } },
    { key: "cumulative", label: { en: "Cumulative race", zh: "累计走势" } }
  ];

  const PLAYERS = {
    ronaldo: {
      name: { en: "Ronaldo", zh: "C罗" },
      color: "#1e62ff",
      accent: "#0f41c5"
    },
    messi: {
      name: { en: "Messi", zh: "梅西" },
      color: "#be173f",
      accent: "#a31137"
    }
  };

  const COPY = {
    loadingHeading: { en: "Loading knockout explorer", zh: "正在加载淘汰赛看板" },
    loadingCopy: {
      en: "Reading the local season-stage datasets for Ronaldo and Messi.",
      zh: "正在读取 C罗与梅西的本地赛季阶段数据。"
    },
    loadingHint: {
      en: "This page needs a local web server so the CSV files can be fetched.",
      zh: "此页面需要通过本地 Web 服务器打开，才能读取 CSV 数据。"
    },
    heading: { en: "Knockout Explorer", zh: "淘汰赛交互看板" },
    copy: {
      en: "Switch stages and metrics to see where each player built his Champions League knockout edge.",
      zh: "切换阶段与指标，观察两人如何在欧冠淘汰赛中建立自己的优势。"
    },
    stageLabel: { en: "Stage focus", zh: "阶段筛选" },
    metricLabel: { en: "Metric view", zh: "指标视图" },
    chartTitle: { en: "Season trend explorer", zh: "赛季走势联动图" },
    chartModeLabel: { en: "Chart mode", zh: "图表模式" },
    zoomLabel: { en: "Brush zoom", zh: "刷选缩放" },
    zoomReset: { en: "Reset zoom", zh: "重置缩放" },
    chartCopySeason: {
      en: "Hover season spikes, click a point to pin that year, and drag the overview brush below to zoom the main chart.",
      zh: "悬停查看单赛季峰值，点击点位固定年份，并拖动下方概览刷选条缩放主图。"
    },
    chartCopyCumulative: {
      en: "Switch to the cumulative race to see when each player actually built a lasting knockout edge, then narrow the time window with the brush.",
      zh: "切到累计走势后，可以看到两人究竟是在什么年份逐步拉开差距，并继续用刷选条收窄时间窗口。"
    },
    chartFallback: {
      en: "The comparison chart needs D3 to render. The cards and table are still available below.",
      zh: "这块对比图需要 D3 才能渲染，下方卡片和表格仍可正常使用。"
    },
    chartEmpty: {
      en: "No season data is available for the current filter.",
      zh: "当前筛选条件下没有可显示的赛季数据。"
    },
    seasonSeries: { en: "Season value", zh: "单赛季值" },
    cumulativeSeries: { en: "Cumulative total", zh: "累计总值" },
    overviewLabel: { en: "Zoom window", zh: "缩放窗口" },
    clickHint: {
      en: "Use the pills, stage cards, chart points, brush window, or season table to move through the data.",
      zh: "你可以通过顶部按钮、阶段卡片、图表点位、刷选窗口或赛季表在这组数据里来回切换。"
    },
    heatmapTitle: { en: "Pressure heatmap", zh: "压力热力图" },
    heatmapCopy: {
      en: "Each cell shows the stage edge for the current metric. Blue favors Ronaldo, red favors Messi. Click a cell to jump the whole page to that stage and season.",
      zh: "每个格子显示当前指标下的阶段优势。蓝色偏向 C罗，红色偏向梅西。点击任意格子，整页都会跳到对应阶段和赛季。"
    },
    heatmapFallback: {
      en: "Heatmap rendering needs D3. The rest of the explorer remains available.",
      zh: "热力图需要 D3 才能渲染，其余交互仍可正常使用。"
    },
    heatmapEmpty: {
      en: "No stage-season matrix is available for the current metric.",
      zh: "当前指标下没有可显示的阶段赛季矩阵。"
    },
    heatmapEdge: { en: "Edge", zh: "优势" },
    heatmapStage: { en: "Stage", zh: "阶段" },
    heatmapSeason: { en: "Season", zh: "赛季" },
    stageTitle: { en: "Stage-by-stage edge", zh: "分阶段优势对比" },
    stageCopy: {
      en: "Each card uses the current metric. Click a stage card to sync the chart, heatmap highlight, and season table.",
      zh: "每张卡片都使用当前指标。点击任一阶段卡片，图表、热力图高亮与赛季表都会同步切换。"
    },
    summaryLeader: { en: "Current edge", zh: "当前优势" },
    tableSeason: { en: "Season", zh: "赛季" },
    tableRonaldoClub: { en: "Ronaldo club", zh: "C罗球队" },
    tableRonaldoValue: { en: "Ronaldo value", zh: "C罗数据" },
    tableMessiClub: { en: "Messi club", zh: "梅西球队" },
    tableMessiValue: { en: "Messi value", zh: "梅西数据" },
    tableEdge: { en: "Edge", zh: "优势" },
    level: { en: "Level", zh: "持平" },
    noData: {
      en: "No stage data is available for the current filter.",
      zh: "当前筛选条件下没有可显示的阶段数据。"
    },
    seasonTitle: { en: "Season log", zh: "赛季对照" },
    seasonCopy: {
      en: "Use the chart, heatmap, or table to isolate a single season and inspect where the pressure moments came from.",
      zh: "可以通过图表、热力图或下方表格锁定某一个赛季，快速定位关键压力场次来自哪里。"
    },
    seasonPinnedCopy: {
      en: "Pinned on {season}. Click the same season again to clear the selection.",
      zh: "当前固定在 {season}。再次点击同一个赛季即可取消固定。"
    },
    errorHeading: { en: "Knockout explorer unavailable", zh: "淘汰赛看板暂时不可用" },
    errorCopy: {
      en: "The local datasets could not be loaded. Start the site with a local web server and refresh.",
      zh: "无法加载本地数据集。请通过本地 Web 服务器启动站点后刷新页面。"
    }
  };

  const elements = {
    heading: root.querySelector("[data-knockout-heading]"),
    copy: root.querySelector("[data-knockout-copy]"),
    stageLabel: root.querySelector("[data-knockout-stage-label]"),
    stageControls: root.querySelector("[data-knockout-stage-controls]"),
    metricLabel: root.querySelector("[data-knockout-metric-label]"),
    metricControls: root.querySelector("[data-knockout-metric-controls]"),
    hint: root.querySelector("[data-knockout-hint]"),
    summary: root.querySelector("[data-knockout-summary]"),
    chartTitle: document.querySelector("[data-knockout-chart-title]"),
    chartCopy: document.querySelector("[data-knockout-chart-copy]"),
    chartModeLabel: document.querySelector("[data-knockout-chart-mode-label]"),
    chartModeControls: document.querySelector("[data-knockout-chart-mode-controls]"),
    zoomLabel: document.querySelector("[data-knockout-zoom-label]"),
    resetZoom: document.querySelector("[data-knockout-reset-zoom]"),
    chartLegend: document.querySelector("[data-knockout-chart-legend]"),
    chartHost: document.querySelector("[data-knockout-chart-host]"),
    chartTooltip: document.querySelector("[data-knockout-chart-tooltip]"),
    heatmapTitle: document.querySelector("[data-knockout-heatmap-title]"),
    heatmapCopy: document.querySelector("[data-knockout-heatmap-copy]"),
    heatmapHost: document.querySelector("[data-knockout-heatmap-host]"),
    heatmapTooltip: document.querySelector("[data-knockout-heatmap-tooltip]"),
    stageTitle: document.querySelector("[data-knockout-stage-title]"),
    stageCopy: document.querySelector("[data-knockout-stage-copy]"),
    stageGrid: document.querySelector("[data-knockout-stage-grid]"),
    seasonTitle: document.querySelector("[data-knockout-season-title]"),
    seasonCopy: document.querySelector("[data-knockout-season-copy]"),
    seasonHead: document.querySelector("[data-knockout-season-head]"),
    seasonBody: document.querySelector("[data-knockout-season-body]")
  };

  if (Object.values(elements).some((node) => !node)) {
    return;
  }

  const state = {
    stage: "all",
    metric: "ga",
    chartMode: "season",
    selectedSeason: null,
    range: null
  };

  let dataset = null;
  let hasError = false;

  function getLang() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function textFor(entry) {
    return entry[getLang()];
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function emptyTotals() {
    return { goals: 0, assists: 0, ga: 0 };
  }

  function parseCsvLine(line) {
    const cells = [];
    let current = "";
    let inQuotes = false;

    for (let idx = 0; idx < line.length; idx += 1) {
      const ch = line[idx];
      if (ch === '"') {
        if (inQuotes && line[idx + 1] === '"') {
          current += '"';
          idx += 1;
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
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return row;
    });
  }

  function num(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normalizeSeason(row) {
    if (row.season && row.season.trim()) {
      return row.season.trim();
    }

    const endYear = Number.parseInt(row.season_end_year, 10);
    if (!Number.isFinite(endYear)) {
      return "";
    }

    return `${String(endYear - 1).slice(-2)}/${String(endYear).slice(-2)}`;
  }

  function getStageMeta(key) {
    return STAGES.find((stage) => stage.key === key) || STAGES[0];
  }

  function getMetricMeta(key) {
    return METRICS.find((metric) => metric.key === key) || METRICS[0];
  }

  function playerName(playerKey) {
    return PLAYERS[playerKey].name[getLang()];
  }

  function stageLabel(stageKey) {
    return getStageMeta(stageKey).label[getLang()];
  }

  function metricLabel(metricKey) {
    return getMetricMeta(metricKey).label[getLang()];
  }

  function formatValue(value) {
    return `${Math.round(value)}`;
  }

  function signedValue(value) {
    if (value === 0) {
      return "0";
    }
    return `${value > 0 ? "+" : ""}${Math.round(value)}`;
  }

  function getLeaderKey(ronaldoValue, messiValue) {
    if (ronaldoValue === messiValue) {
      return "draw";
    }
    return ronaldoValue > messiValue ? "ronaldo" : "messi";
  }

  function getEdgeText(ronaldoValue, messiValue) {
    const leaderKey = getLeaderKey(ronaldoValue, messiValue);
    if (leaderKey === "draw") {
      return textFor(COPY.level);
    }
    return `${playerName(leaderKey)} +${formatValue(Math.abs(ronaldoValue - messiValue))}`;
  }

  function setButtonDisabled(button, disabled) {
    button.disabled = disabled;
    button.setAttribute("aria-disabled", disabled ? "true" : "false");
    button.style.opacity = disabled ? "0.55" : "1";
    button.style.cursor = disabled ? "default" : "pointer";
  }

  function ensureSeasonRecord(seasons, row) {
    const season = normalizeSeason(row);
    const endYear = Number.parseInt(row.season_end_year, 10);

    if (!seasons.has(season)) {
      const stats = { all: emptyTotals() };
      const clubs = { all: "" };

      STAGE_KEYS.forEach((stageKey) => {
        stats[stageKey] = emptyTotals();
        clubs[stageKey] = "";
      });

      seasons.set(season, {
        season,
        endYear: Number.isFinite(endYear) ? endYear : 0,
        clubs,
        stats
      });
    }

    return seasons.get(season);
  }

  function aggregatePlayer(rows) {
    const seasons = new Map();
    const totals = { all: emptyTotals() };

    STAGE_KEYS.forEach((stageKey) => {
      totals[stageKey] = emptyTotals();
    });

    rows.forEach((row) => {
      const seasonRecord = ensureSeasonRecord(seasons, row);

      STAGE_KEYS.forEach((stageKey) => {
        const goals = num(row[`goals_${stageKey}`]);
        const assists = num(row[`assists_${stageKey}`]);
        const ga = goals + assists;
        const club = (row[`club_${stageKey}`] || "").trim();

        seasonRecord.stats[stageKey].goals += goals;
        seasonRecord.stats[stageKey].assists += assists;
        seasonRecord.stats[stageKey].ga += ga;

        seasonRecord.stats.all.goals += goals;
        seasonRecord.stats.all.assists += assists;
        seasonRecord.stats.all.ga += ga;

        totals[stageKey].goals += goals;
        totals[stageKey].assists += assists;
        totals[stageKey].ga += ga;

        totals.all.goals += goals;
        totals.all.assists += assists;
        totals.all.ga += ga;

        if (club) {
          seasonRecord.clubs[stageKey] = club;
          if (!seasonRecord.clubs.all) {
            seasonRecord.clubs.all = club;
          }
        }
      });
    });

    return { seasons, totals };
  }

  function getSeasonClub(record, stageKey) {
    if (!record) {
      return "—";
    }

    const club = stageKey === "all" ? record.clubs.all : record.clubs[stageKey] || record.clubs.all;
    return club || "—";
  }

  function getSeasonValue(record, stageKey, metricKey) {
    if (!record) {
      return 0;
    }
    return record.stats[stageKey][metricKey];
  }

  function getSeasonRows(stageKey, metricKey, sortDirection = "desc") {
    const seasons = new Set([
      ...dataset.ronaldo.seasons.keys(),
      ...dataset.messi.seasons.keys()
    ]);

    const rows = Array.from(seasons)
      .map((season) => {
        const ronaldoSeason = dataset.ronaldo.seasons.get(season);
        const messiSeason = dataset.messi.seasons.get(season);
        const ronaldoValue = getSeasonValue(ronaldoSeason, stageKey, metricKey);
        const messiValue = getSeasonValue(messiSeason, stageKey, metricKey);
        const ronaldoClub = getSeasonClub(ronaldoSeason, stageKey);
        const messiClub = getSeasonClub(messiSeason, stageKey);
        const hasPresence =
          stageKey === "all"
            ? Boolean(
                (ronaldoSeason && ronaldoSeason.clubs.all) ||
                  (messiSeason && messiSeason.clubs.all) ||
                  ronaldoValue ||
                  messiValue
              )
            : Boolean(
                (ronaldoSeason && (ronaldoSeason.clubs[stageKey] || ronaldoSeason.stats[stageKey].ga)) ||
                  (messiSeason && (messiSeason.clubs[stageKey] || messiSeason.stats[stageKey].ga)) ||
                  ronaldoValue ||
                  messiValue
              );

        return {
          season,
          endYear: Math.max(ronaldoSeason?.endYear || 0, messiSeason?.endYear || 0),
          ronaldoClub,
          messiClub,
          ronaldoValue,
          messiValue,
          hasPresence
        };
      })
      .filter((row) => row.hasPresence);

    rows.sort((left, right) => {
      const base = left.endYear - right.endYear || left.season.localeCompare(right.season);
      return sortDirection === "asc" ? base : -base;
    });

    return rows;
  }

  function getChartRows() {
    const baseRows = getSeasonRows(state.stage, state.metric, "asc");

    if (state.chartMode !== "cumulative") {
      return baseRows.map((row) => ({
        ...row,
        ronaldoChartValue: row.ronaldoValue,
        messiChartValue: row.messiValue
      }));
    }

    let ronaldoRunning = 0;
    let messiRunning = 0;

    return baseRows.map((row) => {
      ronaldoRunning += row.ronaldoValue;
      messiRunning += row.messiValue;
      return {
        ...row,
        ronaldoChartValue: ronaldoRunning,
        messiChartValue: messiRunning
      };
    });
  }

  function getHeatmapData() {
    const seasonsAsc = Array.from(
      new Set([
        ...dataset.ronaldo.seasons.keys(),
        ...dataset.messi.seasons.keys()
      ])
    )
      .map((season) => {
        const ronaldoSeason = dataset.ronaldo.seasons.get(season);
        const messiSeason = dataset.messi.seasons.get(season);
        return {
          season,
          endYear: Math.max(ronaldoSeason?.endYear || 0, messiSeason?.endYear || 0)
        };
      })
      .sort((left, right) => left.endYear - right.endYear || left.season.localeCompare(right.season))
      .map((entry) => entry.season);

    const cells = STAGE_KEYS.flatMap((stageKey) =>
      seasonsAsc.map((season) => {
        const ronaldoSeason = dataset.ronaldo.seasons.get(season);
        const messiSeason = dataset.messi.seasons.get(season);
        const ronaldoValue = getSeasonValue(ronaldoSeason, stageKey, state.metric);
        const messiValue = getSeasonValue(messiSeason, stageKey, state.metric);

        return {
          stageKey,
          season,
          ronaldoValue,
          messiValue,
          edge: ronaldoValue - messiValue,
          ronaldoClub: getSeasonClub(ronaldoSeason, stageKey),
          messiClub: getSeasonClub(messiSeason, stageKey)
        };
      })
    );

    return { seasonsAsc, cells };
  }

  function syncSelection(rows) {
    if (!state.selectedSeason) {
      return;
    }

    const seasonSet = new Set(rows.map((row) => row.season));
    if (!seasonSet.has(state.selectedSeason)) {
      state.selectedSeason = null;
    }
  }

  function syncRange(chartRows) {
    if (!chartRows.length) {
      state.range = null;
      return;
    }

    if (!state.range) {
      state.range = [0, chartRows.length - 1];
      return;
    }

    let [start, end] = state.range;
    const maxIndex = chartRows.length - 1;
    start = Math.max(0, Math.min(start, maxIndex));
    end = Math.max(start, Math.min(end, maxIndex));

    if (start === end && maxIndex > 0) {
      if (end < maxIndex) {
        end += 1;
      } else {
        start -= 1;
      }
    }

    state.range = [start, end];
  }

  function isFullRange(chartRows) {
    if (!chartRows.length) {
      return true;
    }

    syncRange(chartRows);
    return state.range[0] === 0 && state.range[1] === chartRows.length - 1;
  }

  function getVisibleChartRows(chartRows) {
    if (!chartRows.length) {
      return [];
    }

    syncRange(chartRows);
    return chartRows.slice(state.range[0], state.range[1] + 1);
  }

  function renderButtonGroup(items, activeKey, attrName) {
    const lang = getLang();

    return items
      .map((item) => {
        const label = item.label[lang] || item.label.en || item.label.zh || "";
        const isActive = item.key === activeKey ? " is-active" : "";
        return `<button class="goals-filter-btn${isActive}" type="button" ${attrName}="${item.key}">${escapeHtml(label)}</button>`;
      })
      .join("");
  }

  function renderControls() {
    elements.stageControls.innerHTML = renderButtonGroup(STAGES, state.stage, "data-stage-key");
    elements.metricControls.innerHTML = renderButtonGroup(METRICS, state.metric, "data-metric-key");
    elements.chartModeControls.innerHTML = renderButtonGroup(
      CHART_MODES,
      state.chartMode,
      "data-chart-mode-key"
    );
  }

  function renderLegend() {
    elements.chartLegend.innerHTML = `
      <span class="compare-legend__item" style="color:#111111;">
        <span class="compare-legend__swatch compare-legend__swatch--ronaldo"></span>
        ${escapeHtml(playerName("ronaldo"))}
      </span>
      <span class="compare-legend__item" style="color:#111111;">
        <span class="compare-legend__swatch compare-legend__swatch--messi"></span>
        ${escapeHtml(playerName("messi"))}
      </span>
    `;
  }

  function renderSummary() {
    const currentStage = state.stage;
    const currentMetric = state.metric;
    const ronaldoValue = dataset.ronaldo.totals[currentStage][currentMetric];
    const messiValue = dataset.messi.totals[currentStage][currentMetric];
    const stageName = stageLabel(currentStage);
    const metricName = metricLabel(currentMetric);
    const leaderKey = getLeaderKey(ronaldoValue, messiValue);
    const gap = Math.abs(ronaldoValue - messiValue);
    const lang = getLang();

    const leaderValue =
      leaderKey === "draw" ? textFor(COPY.level) : playerName(leaderKey);

    const leaderDetail =
      leaderKey === "draw"
        ? lang === "zh"
          ? `${stageName}中两人同为 ${formatValue(ronaldoValue)}`
          : `Both players are on ${formatValue(ronaldoValue)} in ${stageName}.`
        : lang === "zh"
          ? `在${stageName}领先 ${formatValue(gap)}`
          : `Leads by ${formatValue(gap)} in ${stageName}.`;

    elements.summary.innerHTML = `
      <article class="goals-leader-card">
        <span class="goals-leader-card__rank">${escapeHtml(metricName)}</span>
        <h3>${escapeHtml(playerName("ronaldo"))}</h3>
        <strong>${formatValue(ronaldoValue)}</strong>
        <p>${escapeHtml(stageName)}</p>
      </article>
      <article class="goals-leader-card">
        <span class="goals-leader-card__rank">${escapeHtml(metricName)}</span>
        <h3>${escapeHtml(playerName("messi"))}</h3>
        <strong>${formatValue(messiValue)}</strong>
        <p>${escapeHtml(stageName)}</p>
      </article>
      <article class="goals-leader-card">
        <span class="goals-leader-card__rank">${escapeHtml(textFor(COPY.summaryLeader))}</span>
        <h3>${escapeHtml(leaderValue)}</h3>
        <strong>${formatValue(gap)}</strong>
        <p>${escapeHtml(leaderDetail)}</p>
      </article>
    `;
  }

  function renderStageCards() {
    const currentMetric = state.metric;

    elements.stageGrid.innerHTML = STAGES.map((stage) => {
      const ronaldoValue = dataset.ronaldo.totals[stage.key][currentMetric];
      const messiValue = dataset.messi.totals[stage.key][currentMetric];
      const leaderKey = getLeaderKey(ronaldoValue, messiValue);
      const maxValue = Math.max(ronaldoValue, messiValue, 1);
      const ronaldoWidth = ((ronaldoValue / maxValue) * 100).toFixed(1);
      const messiWidth = ((messiValue / maxValue) * 100).toFixed(1);
      const edgeClass =
        leaderKey === "draw"
          ? "knockout-stage-card__edge--draw"
          : `knockout-stage-card__edge--${leaderKey}`;
      const isActive = stage.key === state.stage ? " is-active" : "";

      return `
        <button class="knockout-stage-card${isActive}" type="button" data-stage-key="${stage.key}" aria-pressed="${stage.key === state.stage}">
          <div class="knockout-stage-card__header">
            <span class="knockout-stage-card__title">${escapeHtml(stage.label[getLang()])}</span>
            <span class="knockout-stage-card__edge ${edgeClass}">${escapeHtml(
              getEdgeText(ronaldoValue, messiValue)
            )}</span>
          </div>
          <div class="knockout-stage-card__row">
            <div class="knockout-stage-card__meta">
              <span class="knockout-stage-card__name">${escapeHtml(playerName("ronaldo"))}</span>
              <span class="knockout-stage-card__value">${formatValue(ronaldoValue)}</span>
            </div>
            <div class="knockout-stage-bar knockout-stage-bar--ronaldo"><span style="width:${ronaldoWidth}%"></span></div>
          </div>
          <div class="knockout-stage-card__row">
            <div class="knockout-stage-card__meta">
              <span class="knockout-stage-card__name">${escapeHtml(playerName("messi"))}</span>
              <span class="knockout-stage-card__value">${formatValue(messiValue)}</span>
            </div>
            <div class="knockout-stage-bar knockout-stage-bar--messi"><span style="width:${messiWidth}%"></span></div>
          </div>
        </button>
      `;
    }).join("");
  }

  function renderSeasonTable(rows) {
    elements.seasonHead.innerHTML = `
      <tr>
        <th>${escapeHtml(textFor(COPY.tableSeason))}</th>
        <th>${escapeHtml(textFor(COPY.tableRonaldoClub))}</th>
        <th>${escapeHtml(textFor(COPY.tableRonaldoValue))}</th>
        <th>${escapeHtml(textFor(COPY.tableMessiClub))}</th>
        <th>${escapeHtml(textFor(COPY.tableMessiValue))}</th>
        <th>${escapeHtml(textFor(COPY.tableEdge))}</th>
      </tr>
    `;

    if (!rows.length) {
      elements.seasonBody.innerHTML = `
        <tr>
          <td colspan="6" class="knockout-season-empty">${escapeHtml(textFor(COPY.noData))}</td>
        </tr>
      `;
      return;
    }

    elements.seasonBody.innerHTML = rows
      .map((row) => {
        const isSelected = row.season === state.selectedSeason ? " is-selected" : "";
        return `
          <tr class="knockout-table-row${isSelected}" data-season-key="${row.season}" tabindex="0">
            <td>${escapeHtml(row.season)}</td>
            <td>${escapeHtml(row.ronaldoClub)}</td>
            <td>${formatValue(row.ronaldoValue)}</td>
            <td>${escapeHtml(row.messiClub)}</td>
            <td>${formatValue(row.messiValue)}</td>
            <td>${escapeHtml(getEdgeText(row.ronaldoValue, row.messiValue))}</td>
          </tr>
        `;
      })
      .join("");
  }

  function hideTooltip(tooltip) {
    tooltip.hidden = true;
    tooltip.innerHTML = "";
  }

  function renderChart(chartRows) {
    renderLegend();
    hideTooltip(elements.chartTooltip);

    if (!d3) {
      elements.chartHost.style.width = "";
      elements.chartHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
        textFor(COPY.chartFallback)
      )}</div>`;
      return;
    }

    if (!chartRows.length) {
      elements.chartHost.style.width = "";
      elements.chartHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
        textFor(COPY.chartEmpty)
      )}</div>`;
      return;
    }

    syncRange(chartRows);
    const visibleRows = getVisibleChartRows(chartRows);

    const margin = { top: 30, right: 90, bottom: 160, left: 58 };
    const width = Math.max(920, chartRows.length * 48 + margin.left + margin.right);
    const height = 520;
    const innerWidth = width - margin.left - margin.right;
    const mainHeight = 260;
    const overviewTop = 360;
    const overviewHeight = 58;

    const xMain = d3
      .scalePoint()
      .domain(visibleRows.map((row) => row.season))
      .range([0, innerWidth])
      .padding(0.55);

    const xOverview = d3
      .scaleBand()
      .domain(chartRows.map((_, index) => String(index)))
      .range([0, innerWidth])
      .padding(0.12);

    const overviewCenter = (index) => xOverview(String(index)) + xOverview.bandwidth() / 2;

    const yMain = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          1,
          d3.max(visibleRows, (row) => Math.max(row.ronaldoChartValue, row.messiChartValue)) || 1
        )
      ])
      .nice()
      .range([mainHeight, 0]);

    const yOverview = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          1,
          d3.max(chartRows, (row) => Math.max(row.ronaldoChartValue, row.messiChartValue)) || 1
        )
      ])
      .nice()
      .range([overviewHeight, 0]);

    const tickStep = Math.max(1, Math.ceil(visibleRows.length / 8));
    const tickSeasons = visibleRows
      .filter((_, index) => index % tickStep === 0 || index === visibleRows.length - 1)
      .map((row) => row.season);

    elements.chartHost.style.width = `${width}px`;
    elements.chartHost.innerHTML = "";

    const svg = d3
      .select(elements.chartHost)
      .append("svg")
      .attr("class", "knockout-chart-svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet");

    const plot = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    plot
      .append("g")
      .attr("class", "knockout-grid")
      .call(
        d3
          .axisLeft(yMain)
          .ticks(6)
          .tickSize(-innerWidth)
          .tickFormat("")
      )
      .call((axis) => axis.select(".domain").remove());

    plot
      .append("g")
      .attr("class", "knockout-axis")
      .call(
        d3
          .axisLeft(yMain)
          .ticks(6)
          .tickSize(0)
          .tickFormat((value) => formatValue(value))
      )
      .call((axis) => axis.select(".domain").remove());

    const xAxis = plot
      .append("g")
      .attr("class", "knockout-axis")
      .attr("transform", `translate(0,${mainHeight})`)
      .call(d3.axisBottom(xMain).tickValues(tickSeasons).tickSizeOuter(0));

    xAxis
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .attr("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.45em");

    plot
      .append("text")
      .attr("class", "knockout-chart-label")
      .attr("x", 0)
      .attr("y", -10)
      .text(
        state.chartMode === "cumulative" ? textFor(COPY.cumulativeSeries) : textFor(COPY.seasonSeries)
      );

    const focusBand = plot
      .append("rect")
      .attr("class", "knockout-chart-band")
      .attr("y", 0)
      .attr("height", mainHeight)
      .attr("width", 0)
      .style("display", "none");

    const focusLine = plot
      .append("line")
      .attr("class", "knockout-chart-crosshair")
      .attr("y1", 0)
      .attr("y2", mainHeight)
      .style("display", "none");

    const lineBuilder = (valueKey) =>
      d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((row) => xMain(row.season))
        .y((row) => yMain(row[valueKey]));

    plot
      .append("path")
      .datum(visibleRows)
      .attr("class", "knockout-line knockout-line--ronaldo")
      .attr("d", lineBuilder("ronaldoChartValue"));

    plot
      .append("path")
      .datum(visibleRows)
      .attr("class", "knockout-line knockout-line--messi")
      .attr("d", lineBuilder("messiChartValue"));

    const pointGroup = plot.append("g");

    const pointSelections = [
      {
        valueKey: "ronaldoChartValue",
        dots: pointGroup
          .selectAll(".knockout-dot--ronaldo")
          .data(visibleRows)
          .join("circle")
          .attr("class", "knockout-dot knockout-dot--ronaldo")
          .attr("cx", (row) => xMain(row.season))
          .attr("cy", (row) => yMain(row.ronaldoChartValue))
          .attr("r", (row) => (row.season === state.selectedSeason ? 7 : 4.5))
      },
      {
        valueKey: "messiChartValue",
        dots: pointGroup
          .selectAll(".knockout-dot--messi")
          .data(visibleRows)
          .join("circle")
          .attr("class", "knockout-dot knockout-dot--messi")
          .attr("cx", (row) => xMain(row.season))
          .attr("cy", (row) => yMain(row.messiChartValue))
          .attr("r", (row) => (row.season === state.selectedSeason ? 7 : 4.5))
      }
    ];

    pointSelections.forEach(({ dots }) => {
      dots
        .on("mouseenter", (_, row) => showFocus(row))
        .on("mousemove", (_, row) => showFocus(row))
        .on("mouseleave", () => restoreFocus())
        .on("click", (_, row) => toggleSeasonSelection(row.season));
    });

    const lastVisible = visibleRows[visibleRows.length - 1];
    plot
      .append("text")
      .attr("class", "knockout-end-label knockout-end-label--ronaldo")
      .attr("fill", "#111111")
      .attr("x", xMain(lastVisible.season) + 12)
      .attr("y", yMain(lastVisible.ronaldoChartValue) + 4)
      .text(playerName("ronaldo"));

    plot
      .append("text")
      .attr("class", "knockout-end-label knockout-end-label--messi")
      .attr("fill", "#111111")
      .attr("x", xMain(lastVisible.season) + 12)
      .attr("y", yMain(lastVisible.messiChartValue) + 4)
      .text(playerName("messi"));

    const overlay = plot
      .append("rect")
      .attr("class", "knockout-chart-overlay")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", mainHeight)
      .on("mousemove", (event) => showFocus(getNearestVisibleRow(event)))
      .on("mouseleave", () => restoreFocus())
      .on("click", (event) => toggleSeasonSelection(getNearestVisibleRow(event).season));

    pointGroup.raise();

    const overview = plot
      .append("g")
      .attr("class", "knockout-chart-overview")
      .attr("transform", `translate(0,${overviewTop})`);

    overview
      .append("text")
      .attr("class", "knockout-chart-overview-label")
      .attr("x", 0)
      .attr("y", -12)
      .text(textFor(COPY.overviewLabel));

    overview
      .append("rect")
      .attr("class", "knockout-chart-overview")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", overviewHeight)
      .attr("rx", 10);

    const overviewLine = (valueKey) =>
      d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((row, index) => overviewCenter(index))
        .y((row) => yOverview(row[valueKey]));

    overview
      .append("path")
      .datum(chartRows)
      .attr("class", "knockout-overview-line knockout-overview-line--ronaldo")
      .attr("d", overviewLine("ronaldoChartValue"));

    overview
      .append("path")
      .datum(chartRows)
      .attr("class", "knockout-overview-line knockout-overview-line--messi")
      .attr("d", overviewLine("messiChartValue"));

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, overviewHeight]
      ])
      .on("end", (event) => {
        if (!event.sourceEvent) {
          return;
        }

        if (!event.selection) {
          if (!isFullRange(chartRows)) {
            state.range = [0, chartRows.length - 1];
            render();
          }
          return;
        }

        const [left, right] = event.selection;
        const included = chartRows
          .map((_, index) => index)
          .filter((index) => {
            const center = overviewCenter(index);
            return center >= left && center <= right;
          });

        let start = 0;
        let end = chartRows.length - 1;

        if (included.length) {
          start = included[0];
          end = included[included.length - 1];
        } else {
          const mid = (left + right) / 2;
          const nearestIndex = chartRows.reduce(
            (best, _, index) => {
              const distance = Math.abs(mid - overviewCenter(index));
              return distance < best.distance ? { index, distance } : best;
            },
            { index: 0, distance: Number.POSITIVE_INFINITY }
          ).index;

          start = nearestIndex;
          end = nearestIndex;
        }

        if (start === end && chartRows.length > 1) {
          if (end < chartRows.length - 1) {
            end += 1;
          } else {
            start -= 1;
          }
        }

        if (!state.range || state.range[0] !== start || state.range[1] !== end) {
          state.range = [start, end];
          render();
        }
      });

    const brushGroup = overview.append("g").attr("class", "knockout-brush").call(brush);
    brushGroup.call(
      brush.move,
      [
        xOverview(String(state.range[0])),
        xOverview(String(state.range[1])) + xOverview.bandwidth()
      ]
    );

    function getNearestVisibleRow(event) {
      const [pointerX] = d3.pointer(event, plot.node());
      return visibleRows.reduce(
        (best, row) => {
          const distance = Math.abs(pointerX - xMain(row.season));
          return distance < best.distance ? { row, distance } : best;
        },
        { row: visibleRows[0], distance: Number.POSITIVE_INFINITY }
      ).row;
    }

    function applyVisualFocus(row) {
      if (!row) {
        focusBand.style("display", "none");
        focusLine.style("display", "none");
        pointSelections.forEach(({ dots }) => {
          dots
            .classed("is-selected", false)
            .attr("r", (point) => (point.season === state.selectedSeason ? 7 : 4.5));
        });
        return;
      }

      const xValue = xMain(row.season);
      focusBand
        .style("display", null)
        .attr("x", xValue - 18)
        .attr("width", 36);
      focusLine
        .style("display", null)
        .attr("x1", xValue)
        .attr("x2", xValue);

      pointSelections.forEach(({ dots }) => {
        dots
          .classed("is-selected", (point) => point.season === row.season)
          .attr("r", (point) =>
            point.season === row.season || point.season === state.selectedSeason ? 7 : 4.5
          );
      });
    }

    function positionChartTooltip(row) {
      const leftValue = xMain(row.season) + margin.left;
      const topValue =
        margin.top + Math.min(yMain(row.ronaldoChartValue), yMain(row.messiChartValue)) - 18;
      const placeRight = leftValue < width * 0.62;

      elements.chartTooltip.hidden = false;
      elements.chartTooltip.innerHTML = `
        <strong>${escapeHtml(row.season)}</strong>
        <p>${escapeHtml(
          state.chartMode === "cumulative" ? textFor(COPY.cumulativeSeries) : textFor(COPY.seasonSeries)
        )} · ${escapeHtml(metricLabel(state.metric))}</p>
        <ul>
          <li>
            <span>${escapeHtml(playerName("ronaldo"))} · ${escapeHtml(row.ronaldoClub)}</span>
            <strong>${formatValue(row.ronaldoChartValue)}</strong>
          </li>
          <li>
            <span>${escapeHtml(playerName("messi"))} · ${escapeHtml(row.messiClub)}</span>
            <strong>${formatValue(row.messiChartValue)}</strong>
          </li>
        </ul>
        <p>${escapeHtml(getEdgeText(row.ronaldoChartValue, row.messiChartValue))}</p>
      `;

      const tooltipWidth = elements.chartTooltip.offsetWidth || 240;
      const tooltipHeight = elements.chartTooltip.offsetHeight || 140;
      const left = placeRight ? leftValue + 18 : leftValue - tooltipWidth - 18;
      const top = Math.max(12, Math.min(height - tooltipHeight - 12, topValue));

      elements.chartTooltip.style.left = `${Math.max(12, left)}px`;
      elements.chartTooltip.style.top = `${top}px`;
    }

    function showFocus(row) {
      applyVisualFocus(row);
      positionChartTooltip(row);
    }

    function restoreFocus() {
      const selectedRow = visibleRows.find((row) => row.season === state.selectedSeason) || null;
      applyVisualFocus(selectedRow);
      hideTooltip(elements.chartTooltip);
    }

    const initialRow = visibleRows.find((row) => row.season === state.selectedSeason) || null;
    if (initialRow) {
      applyVisualFocus(initialRow);
    }
  }

  function renderHeatmap(heatmapData) {
    hideTooltip(elements.heatmapTooltip);

    if (!d3) {
      elements.heatmapHost.style.width = "";
      elements.heatmapHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
        textFor(COPY.heatmapFallback)
      )}</div>`;
      return;
    }

    if (!heatmapData.seasonsAsc.length || !heatmapData.cells.length) {
      elements.heatmapHost.style.width = "";
      elements.heatmapHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
        textFor(COPY.heatmapEmpty)
      )}</div>`;
      return;
    }

    const margin = { top: 18, right: 24, bottom: 78, left: 84 };
    const width = Math.max(920, heatmapData.seasonsAsc.length * 48 + margin.left + margin.right);
    const height = 260;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const x = d3
      .scaleBand()
      .domain(heatmapData.seasonsAsc)
      .range([0, innerWidth])
      .padding(0.08);
    const y = d3
      .scaleBand()
      .domain(STAGE_KEYS)
      .range([0, innerHeight])
      .padding(0.12);
    const maxAbs = Math.max(1, d3.max(heatmapData.cells, (cell) => Math.abs(cell.edge)) || 1);
    const color = d3
      .scaleLinear()
      .domain([-maxAbs, 0, maxAbs])
      .range(["#f6a5ba", "#ffffff", "#a8c6ff"]);

    elements.heatmapHost.style.width = `${width}px`;
    elements.heatmapHost.innerHTML = "";

    const svg = d3
      .select(elements.heatmapHost)
      .append("svg")
      .attr("class", "knockout-heatmap-svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet");

    const plot = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxis = plot
      .append("g")
      .attr("class", "knockout-heatmap-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0).tickFormat((value) => value));

    xAxis
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .attr("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.45em");

    plot
      .append("g")
      .attr("class", "knockout-heatmap-axis")
      .call(d3.axisLeft(y).tickSize(0).tickFormat((value) => stageLabel(value)));

    plot
      .append("text")
      .attr("class", "knockout-heatmap-label")
      .attr("x", 0)
      .attr("y", -6)
      .text(`${textFor(COPY.heatmapEdge)} · ${metricLabel(state.metric)}`);

    plot
      .append("text")
      .attr("class", "knockout-heatmap-label")
      .attr("x", 0)
      .attr("y", innerHeight + 62)
      .text(textFor(COPY.heatmapSeason));

    plot
      .append("text")
      .attr("class", "knockout-heatmap-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight)
      .attr("y", -58)
      .text(textFor(COPY.heatmapStage));

    const cells = plot
      .selectAll(".knockout-heatmap-cell")
      .data(heatmapData.cells)
      .join("rect")
      .attr("class", (cell) =>
        cell.stageKey === state.stage && cell.season === state.selectedSeason
          ? "knockout-heatmap-cell is-selected"
          : "knockout-heatmap-cell"
      )
      .attr("x", (cell) => x(cell.season))
      .attr("y", (cell) => y(cell.stageKey))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 8)
      .attr("fill", (cell) => color(cell.edge))
      .on("mouseenter", (_, cell) => showHeatmapTooltip(cell))
      .on("mousemove", (_, cell) => showHeatmapTooltip(cell))
      .on("mouseleave", () => hideTooltip(elements.heatmapTooltip))
      .on("click", (_, cell) => selectHeatmapCell(cell));

    plot
      .selectAll(".knockout-heatmap-text")
      .data(heatmapData.cells)
      .join("text")
      .attr("class", "knockout-heatmap-text")
      .attr("x", (cell) => x(cell.season) + x.bandwidth() / 2)
      .attr("y", (cell) => y(cell.stageKey) + y.bandwidth() / 2)
      .attr("fill", (cell) => (Math.abs(cell.edge) > maxAbs * 0.56 ? "#ffffff" : "#14244a"))
      .text((cell) => signedValue(cell.edge));

    function showHeatmapTooltip(cell) {
      elements.heatmapTooltip.hidden = false;
      elements.heatmapTooltip.innerHTML = `
        <strong>${escapeHtml(cell.season)} · ${escapeHtml(stageLabel(cell.stageKey))}</strong>
        <p>${escapeHtml(metricLabel(state.metric))}</p>
        <ul>
          <li>
            <span>${escapeHtml(playerName("ronaldo"))} · ${escapeHtml(cell.ronaldoClub)}</span>
            <strong>${formatValue(cell.ronaldoValue)}</strong>
          </li>
          <li>
            <span>${escapeHtml(playerName("messi"))} · ${escapeHtml(cell.messiClub)}</span>
            <strong>${formatValue(cell.messiValue)}</strong>
          </li>
        </ul>
        <p>${escapeHtml(getEdgeText(cell.ronaldoValue, cell.messiValue))}</p>
      `;

      const leftValue = x(cell.season) + margin.left + x.bandwidth() / 2;
      const topValue = y(cell.stageKey) + margin.top - 12;
      const tooltipWidth = elements.heatmapTooltip.offsetWidth || 250;
      const tooltipHeight = elements.heatmapTooltip.offsetHeight || 140;
      const placeRight = leftValue < width * 0.62;
      const left = placeRight ? leftValue + 18 : leftValue - tooltipWidth - 18;
      const top = Math.max(10, Math.min(height - tooltipHeight - 10, topValue));

      elements.heatmapTooltip.style.left = `${Math.max(12, left)}px`;
      elements.heatmapTooltip.style.top = `${top}px`;
    }
  }

  function renderText(chartRows) {
    const currentStageName = stageLabel(state.stage);
    const currentMetricName = metricLabel(state.metric);

    elements.heading.textContent = textFor(COPY.heading);
    elements.copy.textContent = textFor(COPY.copy);
    elements.stageLabel.textContent = textFor(COPY.stageLabel);
    elements.metricLabel.textContent = textFor(COPY.metricLabel);
    elements.chartTitle.textContent = textFor(COPY.chartTitle);
    elements.chartModeLabel.textContent = textFor(COPY.chartModeLabel);
    elements.zoomLabel.textContent = textFor(COPY.zoomLabel);
    elements.resetZoom.textContent = textFor(COPY.zoomReset);
    elements.chartCopy.textContent =
      state.chartMode === "cumulative" ? textFor(COPY.chartCopyCumulative) : textFor(COPY.chartCopySeason);
    elements.heatmapTitle.textContent = textFor(COPY.heatmapTitle);
    elements.heatmapCopy.textContent = textFor(COPY.heatmapCopy);
    elements.hint.textContent =
      state.selectedSeason === null
        ? textFor(COPY.clickHint)
        : getLang() === "zh"
          ? `当前固定 ${state.selectedSeason}，并查看 ${currentStageName} 的 ${currentMetricName}。`
          : `${state.selectedSeason} is pinned while viewing ${currentMetricName.toLowerCase()} in ${currentStageName}.`;
    elements.stageTitle.textContent = textFor(COPY.stageTitle);
    elements.stageCopy.textContent = textFor(COPY.stageCopy);
    elements.seasonTitle.textContent =
      getLang() === "zh" ? `${currentStageName}${textFor(COPY.seasonTitle)}` : `${textFor(COPY.seasonTitle)} for ${currentStageName}`;
    elements.seasonCopy.textContent =
      state.selectedSeason === null
        ? textFor(COPY.seasonCopy)
        : textFor(COPY.seasonPinnedCopy).replace("{season}", state.selectedSeason);

    setButtonDisabled(elements.resetZoom, isFullRange(chartRows));
  }

  function renderLoading() {
    elements.heading.textContent = textFor(COPY.loadingHeading);
    elements.copy.textContent = textFor(COPY.loadingCopy);
    elements.stageLabel.textContent = textFor(COPY.stageLabel);
    elements.metricLabel.textContent = textFor(COPY.metricLabel);
    elements.chartTitle.textContent = textFor(COPY.chartTitle);
    elements.chartCopy.textContent = textFor(COPY.loadingCopy);
    elements.chartModeLabel.textContent = textFor(COPY.chartModeLabel);
    elements.zoomLabel.textContent = textFor(COPY.zoomLabel);
    elements.resetZoom.textContent = textFor(COPY.zoomReset);
    elements.heatmapTitle.textContent = textFor(COPY.heatmapTitle);
    elements.heatmapCopy.textContent = textFor(COPY.loadingCopy);
    elements.hint.textContent = textFor(COPY.loadingHint);
    elements.stageControls.innerHTML = "";
    elements.metricControls.innerHTML = "";
    elements.chartModeControls.innerHTML = "";
    elements.chartLegend.innerHTML = "";
    elements.chartHost.style.width = "";
    elements.chartHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
      textFor(COPY.loadingCopy)
    )}</div>`;
    elements.heatmapHost.style.width = "";
    elements.heatmapHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
      textFor(COPY.loadingCopy)
    )}</div>`;
    elements.summary.innerHTML = `
      <article class="goals-leader-card">
        <span class="goals-leader-card__rank">${escapeHtml(textFor(COPY.loadingHeading))}</span>
        <h3>...</h3>
        <p>${escapeHtml(textFor(COPY.loadingCopy))}</p>
      </article>
    `;
    elements.stageTitle.textContent = "";
    elements.stageCopy.textContent = "";
    elements.stageGrid.innerHTML = "";
    elements.seasonTitle.textContent = "";
    elements.seasonCopy.textContent = "";
    elements.seasonHead.innerHTML = "";
    elements.seasonBody.innerHTML = "";
    setButtonDisabled(elements.resetZoom, true);
    hideTooltip(elements.chartTooltip);
    hideTooltip(elements.heatmapTooltip);
  }

  function renderError() {
    elements.heading.textContent = textFor(COPY.errorHeading);
    elements.copy.textContent = textFor(COPY.errorCopy);
    elements.stageLabel.textContent = textFor(COPY.stageLabel);
    elements.metricLabel.textContent = textFor(COPY.metricLabel);
    elements.chartTitle.textContent = textFor(COPY.chartTitle);
    elements.chartCopy.textContent = textFor(COPY.errorCopy);
    elements.chartModeLabel.textContent = textFor(COPY.chartModeLabel);
    elements.zoomLabel.textContent = textFor(COPY.zoomLabel);
    elements.resetZoom.textContent = textFor(COPY.zoomReset);
    elements.heatmapTitle.textContent = textFor(COPY.heatmapTitle);
    elements.heatmapCopy.textContent = textFor(COPY.errorCopy);
    elements.hint.textContent = textFor(COPY.loadingHint);
    elements.stageControls.innerHTML = "";
    elements.metricControls.innerHTML = "";
    elements.chartModeControls.innerHTML = "";
    elements.chartLegend.innerHTML = "";
    elements.chartHost.style.width = "";
    elements.chartHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
      textFor(COPY.errorCopy)
    )}</div>`;
    elements.heatmapHost.style.width = "";
    elements.heatmapHost.innerHTML = `<div class="knockout-chart-empty">${escapeHtml(
      textFor(COPY.errorCopy)
    )}</div>`;
    elements.summary.innerHTML = `
      <article class="goals-leader-card">
        <span class="goals-leader-card__rank">${escapeHtml(textFor(COPY.errorHeading))}</span>
        <h3>${escapeHtml(textFor(COPY.errorHeading))}</h3>
        <p>${escapeHtml(textFor(COPY.errorCopy))}</p>
      </article>
    `;
    elements.stageTitle.textContent = "";
    elements.stageCopy.textContent = "";
    elements.stageGrid.innerHTML = "";
    elements.seasonTitle.textContent = "";
    elements.seasonCopy.textContent = "";
    elements.seasonHead.innerHTML = "";
    elements.seasonBody.innerHTML = "";
    setButtonDisabled(elements.resetZoom, true);
    hideTooltip(elements.chartTooltip);
    hideTooltip(elements.heatmapTooltip);
  }

  function render() {
    if (hasError) {
      renderError();
      return;
    }

    if (!dataset) {
      renderLoading();
      return;
    }

    const chartRows = getChartRows();
    const tableRows = getSeasonRows(state.stage, state.metric, "desc");
    syncSelection(tableRows);
    syncRange(chartRows);

    renderText(chartRows);
    renderControls();
    renderSummary();
    renderChart(chartRows);
    renderHeatmap(getHeatmapData());
    renderStageCards();
    renderSeasonTable(tableRows);
  }

  async function loadData() {
    try {
      const [ronaldoResponse, messiResponse] = await Promise.all([
        fetch(RONALDO_CSV),
        fetch(MESSI_CSV)
      ]);

      if (!ronaldoResponse.ok || !messiResponse.ok) {
        throw new Error("CSV request failed");
      }

      const [ronaldoText, messiText] = await Promise.all([
        ronaldoResponse.text(),
        messiResponse.text()
      ]);

      dataset = {
        ronaldo: aggregatePlayer(parseCsv(ronaldoText)),
        messi: aggregatePlayer(parseCsv(messiText))
      };
      hasError = false;
      render();
    } catch (error) {
      console.error("Failed to load knockout stage data", error);
      dataset = null;
      hasError = true;
      render();
    }
  }

  function toggleSeasonSelection(season) {
    state.selectedSeason = state.selectedSeason === season ? null : season;
    render();
  }

  function selectHeatmapCell(cell) {
    const sameCell = state.stage === cell.stageKey && state.selectedSeason === cell.season;
    state.stage = cell.stageKey;
    state.selectedSeason = sameCell ? null : cell.season;
    render();
  }

  function updateState(key, value) {
    if (!value || state[key] === value) {
      return;
    }
    state[key] = value;
    render();
  }

  elements.metricControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-metric-key]");
    if (button) {
      updateState("metric", button.getAttribute("data-metric-key"));
    }
  });

  function handleStageChange(event) {
    const button = event.target.closest("[data-stage-key]");
    if (button) {
      updateState("stage", button.getAttribute("data-stage-key"));
    }
  }

  elements.stageControls.addEventListener("click", handleStageChange);
  elements.stageGrid.addEventListener("click", handleStageChange);

  elements.chartModeControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-chart-mode-key]");
    if (button) {
      updateState("chartMode", button.getAttribute("data-chart-mode-key"));
    }
  });

  elements.resetZoom.addEventListener("click", () => {
    if (!dataset || elements.resetZoom.disabled) {
      return;
    }

    const chartRows = getChartRows();
    if (chartRows.length) {
      state.range = [0, chartRows.length - 1];
      render();
    }
  });

  elements.seasonBody.addEventListener("click", (event) => {
    const row = event.target.closest("[data-season-key]");
    if (row) {
      toggleSeasonSelection(row.getAttribute("data-season-key"));
    }
  });

  elements.seasonBody.addEventListener("keydown", (event) => {
    const row = event.target.closest("[data-season-key]");
    if (!row) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSeasonSelection(row.getAttribute("data-season-key"));
    }
  });

  const langObserver = new MutationObserver(() => {
    render();
  });

  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  renderLoading();
  loadData();
})();
