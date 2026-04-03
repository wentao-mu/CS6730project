(() => {
  const STORAGE_KEY = "site_lang";
  const DATA_FILE = "assets/data/ucl_player_season_totals_2003_2025.csv";

  const HEATMAP_COLUMNS = [
    { key: "goals", copyKey: "goals", digits: 0 },
    { key: "assists", copyKey: "assists", digits: 0 },
    { key: "ga", copyKey: "ga", digits: 0 },
    { key: "appearances", copyKey: "appearances", digits: 0 },
    { key: "minutes", copyKey: "minutes", digits: 0 },
    { key: "gaPerMatch", copyKey: "gaPerMatch", digits: 2 },
    { key: "gaPer90", copyKey: "gaPer90", digits: 2 }
  ];

  const SNAPSHOT_ROWS = [
    { key: "club", copyKey: "club", type: "text" },
    { key: "country", copyKey: "country", type: "text" },
    { key: "position", copyKey: "position", type: "text" },
    { key: "appearances", copyKey: "appearances", type: "number", digits: 0 },
    { key: "minutes", copyKey: "minutes", type: "number", digits: 0 },
    { key: "goals", copyKey: "goals", type: "number", digits: 0 },
    { key: "assists", copyKey: "assists", type: "number", digits: 0 },
    { key: "ga", copyKey: "ga", type: "number", digits: 0 },
    { key: "goalsPerMatch", copyKey: "goalsPerMatch", type: "number", digits: 2 },
    { key: "assistsPerMatch", copyKey: "assistsPerMatch", type: "number", digits: 2 },
    { key: "gaPerMatch", copyKey: "gaPerMatch", type: "number", digits: 2 },
    { key: "goalsPer90", copyKey: "goalsPer90", type: "number", digits: 2 },
    { key: "assistsPer90", copyKey: "assistsPer90", type: "number", digits: 2 },
    { key: "gaPer90", copyKey: "gaPer90", type: "number", digits: 2 }
  ];

  const COPY = {
    en: {
      eyebrow: "Peak Seasons",
      title: "Champions League Peak Seasons",
      lead:
        "This page ranks the highest single-season goals plus assists campaigns across the full player database. Click any season to open that player's complete archive table and season-by-metric heatmap.",
      rankingTitle: "Single-Season G+A Ranking",
      rankingLead:
        "Peak is defined here as total goals plus assists in one Champions League season, using season totals pulled from UEFA competition statistics.",
      rankingScopeLabel: "Ranking Scope",
      playerSearchLabel: "Player Search",
      searchPlaceholder: "Search any player name",
      top10: "Top 10",
      all: "All",
      rank: "Rank",
      player: "Player",
      season: "Season",
      club: "Club",
      country: "Country",
      position: "Position",
      goals: "Goals",
      assists: "Assists",
      ga: "G+A",
      appearances: "Apps",
      minutes: "Minutes",
      goalsPerMatch: "G / Match",
      assistsPerMatch: "A / Match",
      gaPerMatch: "G+A / Match",
      goalsPer90: "G / 90",
      assistsPer90: "A / 90",
      gaPer90: "G+A / 90",
      metric: "Metric",
      value: "Value",
      heatmapTitle: "Season × Metric Heatmap",
      heatmapLead:
        "Every row is a season, every column is a key output metric. Cell color is normalized within each metric column for the selected player.",
      archiveTitle: "Full Season Table",
      archiveLead:
        "Complete season totals for the selected player, built from the official UEFA competition stats API and cached locally in this project.",
      snapshotTitle: "Selected Season Snapshot",
      snapshotLead:
        "A compact readout of the currently highlighted season. Click any heatmap cell or archive row to move the focus.",
      peakSeason: "Peak season",
      peakOutput: "Peak output",
      careerOutput: "Career total G+A",
      trackedSeasons: "Tracked seasons",
      detailTitle: "{player} · Peak Archive",
      detailCopy:
        "Selected season: {season} for {club}. The table and heatmap below stay linked to the same player profile.",
      selectedMeta:
        "{country} · {position} · {seasons} seasons tracked · {careerGa} career G+A",
      peakOutputValue: "{ga} G+A",
      careerOutputValue: "{ga} G+A",
      trackedSeasonsValue: "{count} seasons",
      rankingHintTop: "Showing top {shown} seasons out of {total} tracked player-seasons.",
      rankingHintAll: "Showing all {total} tracked player-seasons.",
      rankingHintSearch:
        "Showing {shown} results for \"{query}\" across {players} matching players.",
      noClub: "—",
      noData: "No data",
      unknownPlayer: "Unknown player",
      unknownText: "Unknown",
      tooltipSeason: "Season",
      tooltipMetric: "Metric",
      tooltipValue: "Value",
      tooltipClub: "Club",
      peakSeasonLabel: "Peak season ranking",
      archiveEmpty: "No season data available."
    },
    zh: {
      eyebrow: "巅峰赛季",
      title: "欧冠巅峰赛季",
      lead:
        "这个页面会在全员数据库里按单赛季进球+助攻总和给出排名。点击任意赛季后，会打开该球员的完整档案表和赛季×指标热力图。",
      rankingTitle: "单赛季 G+A 排名",
      rankingLead:
        "这里把巅峰定义为单个欧冠赛季中的总进球+助攻，数据来自欧足联比赛统计接口并缓存在本项目中。",
      rankingScopeLabel: "排行范围",
      playerSearchLabel: "球员搜索",
      searchPlaceholder: "搜索任意球员姓名",
      top10: "前10",
      all: "全部",
      rank: "排名",
      player: "球员",
      season: "赛季",
      club: "俱乐部",
      country: "国家",
      position: "位置",
      goals: "进球",
      assists: "助攻",
      ga: "进球+助攻",
      appearances: "出场",
      minutes: "分钟",
      goalsPerMatch: "场均进球",
      assistsPerMatch: "场均助攻",
      gaPerMatch: "场均 G+A",
      goalsPer90: "每90分钟进球",
      assistsPer90: "每90分钟助攻",
      gaPer90: "每90分钟 G+A",
      metric: "指标",
      value: "数值",
      heatmapTitle: "赛季 × 指标 热力图",
      heatmapLead:
        "每一行代表一个赛季，每一列代表一个关键输出指标。颜色会在所选球员的同一列内做归一化。",
      archiveTitle: "完整赛季总表",
      archiveLead:
        "这里是所选球员的完整赛季总表，数据来自欧足联官方比赛统计接口，并已缓存在本项目本地。",
      snapshotTitle: "当前赛季快照",
      snapshotLead:
        "当前高亮赛季的紧凑读数。点击任意热力图格子或赛季表行都可以切换焦点。",
      peakSeason: "巅峰赛季",
      peakOutput: "最高产出",
      careerOutput: "生涯总 G+A",
      trackedSeasons: "覆盖赛季",
      detailTitle: "{player} · 巅峰档案",
      detailCopy: "当前选中赛季：{season}，俱乐部：{club}。下方表格和热力图会联动到同一球员档案。",
      selectedMeta: "{country} · {position} · 共 {seasons} 个赛季 · 生涯 {careerGa} 次 G+A",
      peakOutputValue: "{ga} 次 G+A",
      careerOutputValue: "{ga} 次 G+A",
      trackedSeasonsValue: "{count} 个赛季",
      rankingHintTop: "当前显示全部 {total} 个赛季记录中的前 {shown} 名。",
      rankingHintAll: "当前显示全部 {total} 个已跟踪赛季记录。",
      rankingHintSearch: "当前显示与\"{query}\"匹配的 {players} 名球员中的 {shown} 条结果。",
      noClub: "—",
      noData: "无数据",
      unknownPlayer: "未知球员",
      unknownText: "未知",
      tooltipSeason: "赛季",
      tooltipMetric: "指标",
      tooltipValue: "数值",
      tooltipClub: "俱乐部",
      peakSeasonLabel: "巅峰赛季排行",
      archiveEmpty: "暂无赛季数据。"
    }
  };

  const state = {
    lang: localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en",
    limit: "10",
    searchTerm: "",
    activePlayerId: null,
    selectedSeasonId: null,
    dataByPlayer: new Map(),
    ranking: []
  };

  const elements = {};

  function replaceTokens(template, replacements) {
    return template.replace(/\{(\w+)\}/g, (_, key) => `${replacements[key] ?? ""}`);
  }

  function copy(key, replacements) {
    const template = COPY[state.lang][key] || COPY.en[key] || key;
    return replacements ? replaceTokens(template, replacements) : template;
  }

  function readNumber(rawValue) {
    const value = Number(rawValue);
    return Number.isFinite(value) ? value : 0;
  }

  function normalizeText(value) {
    return `${value ?? ""}`.trim().toLowerCase();
  }

  function formatValue(value, digits = 0) {
    if (!Number.isFinite(value)) {
      return copy("noData");
    }

    return value.toLocaleString(state.lang === "zh" ? "zh-CN" : "en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function formatMetricValue(key, value) {
    const metric = HEATMAP_COLUMNS.find((column) => column.key === key)
      || SNAPSHOT_ROWS.find((row) => row.key === key);
    if (!metric || metric.type === "text") {
      return value || copy("unknownText");
    }
    return formatValue(value, metric.digits ?? 0);
  }

  function toDisplayName(row) {
    return (
      `${row.player_name ?? ""}`.trim()
      || `${row.player_short_name ?? ""}`.trim()
      || `${copy("unknownPlayer")} #${row.player_id || "?"}`
    );
  }

  function parseRow(row) {
    const playerId = `${row.player_id ?? ""}`.trim();
    const playerName = toDisplayName(row);
    const shortName = `${row.player_short_name ?? ""}`.trim() || playerName;
    const club = `${row.club_display_name ?? ""}`.trim() || `${row.club ?? ""}`.trim() || copy("noClub");
    const country = `${row.country ?? ""}`.trim() || copy("unknownText");
    const position = `${row.position ?? ""}`.trim() || copy("unknownText");

    return {
      id: `${playerId}-${row.season_end_year}`,
      playerId,
      playerName,
      shortName,
      season: `${row.season ?? ""}`.trim(),
      seasonEndYear: readNumber(row.season_end_year),
      club,
      country,
      position,
      appearances: readNumber(row.appearances),
      minutes: readNumber(row.minutes),
      goals: readNumber(row.goals),
      assists: readNumber(row.assists),
      ga: readNumber(row.ga),
      goalsPerMatch: readNumber(row.goals_per_match),
      assistsPerMatch: readNumber(row.assists_per_match),
      gaPerMatch: readNumber(row.ga_per_match),
      goalsPer90: readNumber(row.goals_per_90),
      assistsPer90: readNumber(row.assists_per_90),
      gaPer90: readNumber(row.ga_per_90)
    };
  }

  function getPlayerArchive(playerId) {
    return state.dataByPlayer.get(playerId) || [];
  }

  function getPlayerPeak(playerId) {
    const archive = getPlayerArchive(playerId);
    return [...archive].sort((left, right) => {
      if (right.ga !== left.ga) {
        return right.ga - left.ga;
      }
      if (right.goals !== left.goals) {
        return right.goals - left.goals;
      }
      if (right.assists !== left.assists) {
        return right.assists - left.assists;
      }
      return right.seasonEndYear - left.seasonEndYear;
    })[0] || null;
  }

  function getSelectedSeason() {
    const archive = getPlayerArchive(state.activePlayerId);
    return archive.find((season) => season.id === state.selectedSeasonId) || null;
  }

  function getFilteredRanking() {
    const query = normalizeText(state.searchTerm);
    if (!query) {
      return state.ranking;
    }

    return state.ranking.filter((season) => {
      const haystacks = [season.playerName, season.shortName, season.club, season.country];
      return haystacks.some((value) => normalizeText(value).includes(query));
    });
  }

  function getVisibleRanking() {
    const filtered = getFilteredRanking();
    if (state.limit === "all") {
      return filtered;
    }
    return filtered.slice(0, Number(state.limit));
  }

  function uniquePlayerCount(rows) {
    return new Set(rows.map((row) => row.playerId)).size;
  }

  function syncSelection() {
    const selected = getSelectedSeason();
    const filtered = getFilteredRanking();

    if (selected && filtered.some((row) => row.id === selected.id)) {
      return;
    }

    const preferred = filtered[0] || state.ranking[0] || null;
    if (!preferred) {
      state.activePlayerId = null;
      state.selectedSeasonId = null;
      return;
    }

    state.activePlayerId = preferred.playerId;
    state.selectedSeasonId = preferred.id;
  }

  function collectElements() {
    elements.staticCopy = [...document.querySelectorAll("[data-peak-copy]")];
    elements.leaders = document.querySelector("[data-peak-leaders]");
    elements.rankingSummary = document.querySelector("[data-peak-ranking-summary]");
    elements.rankingBody = document.querySelector("[data-peak-ranking-body]");
    elements.limitButtons = [...document.querySelectorAll("[data-peak-limit]")];
    elements.searchInput = document.querySelector("[data-peak-search]");
    elements.detailTitle = document.querySelector("[data-peak-detail-title]");
    elements.detailCopy = document.querySelector("[data-peak-detail-copy]");
    elements.selectedMeta = document.querySelector("[data-peak-selected-meta]");
    elements.summary = document.querySelector("[data-peak-summary]");
    elements.snapshotBody = document.querySelector("[data-peak-snapshot-body]");
    elements.archiveBody = document.querySelector("[data-peak-archive-body]");
    elements.heatmapHost = document.querySelector("[data-peak-heatmap]");
    elements.tooltip = document.querySelector("[data-peak-tooltip]");
  }

  function renderStaticCopy() {
    elements.staticCopy.forEach((element) => {
      element.textContent = copy(element.dataset.peakCopy);
    });

    elements.limitButtons.forEach((button) => {
      const isActive = button.dataset.peakLimit === state.limit;
      button.textContent = button.dataset.peakLimit === "10" ? copy("top10") : copy("all");
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (elements.searchInput) {
      elements.searchInput.placeholder = copy("searchPlaceholder");
      elements.searchInput.value = state.searchTerm;
    }
  }

  function renderLeaderCards() {
    const visible = getVisibleRanking().slice(0, 3);
    elements.leaders.innerHTML = visible
      .map((season, index) => {
        const isSelected = season.id === state.selectedSeasonId;
        return `
          <button
            class="goals-leader-card peak-leader-card${isSelected ? " is-selected" : ""}"
            type="button"
            data-peak-select="${season.id}"
          >
            <span class="goals-leader-card__rank">#${index + 1}</span>
            <h3>${season.playerName} · ${season.season}</h3>
            <strong>${formatValue(season.ga)} ${copy("ga")}</strong>
            <p>${formatValue(season.goals)} ${copy("goals")} · ${formatValue(season.assists)} ${copy("assists")} · ${season.club}</p>
          </button>
        `;
      })
      .join("");

    elements.leaders.querySelectorAll("[data-peak-select]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = state.ranking.find((row) => row.id === button.dataset.peakSelect);
        if (!target) {
          return;
        }
        state.activePlayerId = target.playerId;
        state.selectedSeasonId = target.id;
        render();
      });
    });
  }

  function renderRankingSummary() {
    if (!elements.rankingSummary) {
      return;
    }

    const filtered = getFilteredRanking();
    const visible = getVisibleRanking();
    const query = state.searchTerm.trim();

    if (query) {
      elements.rankingSummary.textContent = copy("rankingHintSearch", {
        shown: formatValue(visible.length),
        query,
        players: formatValue(uniquePlayerCount(filtered))
      });
      return;
    }

    elements.rankingSummary.textContent =
      state.limit === "all"
        ? copy("rankingHintAll", { total: formatValue(filtered.length) })
        : copy("rankingHintTop", {
            shown: formatValue(visible.length),
            total: formatValue(filtered.length)
          });
  }

  function renderRankingTable() {
    const visible = getVisibleRanking();
    elements.rankingBody.innerHTML = visible
      .map((season, index) => {
        const isSelected = season.id === state.selectedSeasonId;
        return `
          <tr class="peak-table-row${isSelected ? " is-selected" : ""}" tabindex="0" data-peak-select="${season.id}">
            <td>${index + 1}</td>
            <td><span class="peak-player-chip">${season.playerName}</span></td>
            <td>${season.season}</td>
            <td>${season.club}</td>
            <td>${formatValue(season.goals)}</td>
            <td>${formatValue(season.assists)}</td>
            <td>${formatValue(season.ga)}</td>
            <td>${formatValue(season.appearances)}</td>
          </tr>
        `;
      })
      .join("");

    elements.rankingBody.querySelectorAll("[data-peak-select]").forEach((row) => {
      const handleSelect = () => {
        const target = state.ranking.find((entry) => entry.id === row.dataset.peakSelect);
        if (!target) {
          return;
        }
        state.activePlayerId = target.playerId;
        state.selectedSeasonId = target.id;
        render();
      };

      row.addEventListener("click", handleSelect);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      });
    });
  }

  function renderDetailHeader() {
    const selected = getSelectedSeason();
    const archive = getPlayerArchive(state.activePlayerId);

    if (!selected || !archive.length) {
      elements.detailTitle.textContent = copy("archiveEmpty");
      elements.detailCopy.textContent = copy("archiveEmpty");
      elements.selectedMeta.textContent = "";
      return;
    }

    const careerGa = archive.reduce((sum, season) => sum + season.ga, 0);
    elements.detailTitle.textContent = copy("detailTitle", { player: selected.playerName });
    elements.detailCopy.textContent = copy("detailCopy", {
      season: selected.season,
      club: selected.club
    });
    elements.selectedMeta.textContent = copy("selectedMeta", {
      country: selected.country,
      position: selected.position,
      seasons: formatValue(archive.length),
      careerGa: formatValue(careerGa)
    });
  }

  function renderSummaryCards() {
    const archive = getPlayerArchive(state.activePlayerId);
    const peak = getPlayerPeak(state.activePlayerId);
    const careerGa = archive.reduce((sum, season) => sum + season.ga, 0);

    if (!peak) {
      elements.summary.innerHTML = "";
      return;
    }

    const cards = [
      {
        label: copy("peakSeason"),
        value: peak.season,
        meta: peak.club
      },
      {
        label: copy("peakOutput"),
        value: copy("peakOutputValue", { ga: formatValue(peak.ga) }),
        meta: `${formatValue(peak.goals)} ${copy("goals")} · ${formatValue(peak.assists)} ${copy("assists")}`
      },
      {
        label: copy("careerOutput"),
        value: copy("careerOutputValue", { ga: formatValue(careerGa) }),
        meta: peak.playerName
      },
      {
        label: copy("trackedSeasons"),
        value: copy("trackedSeasonsValue", { count: formatValue(archive.length) }),
        meta: `${peak.country} · ${peak.position}`
      }
    ];

    elements.summary.innerHTML = cards
      .map(
        (card) => `
          <article class="goals-leader-card peak-summary-card">
            <span class="goals-leader-card__rank">${card.label}</span>
            <h3>${card.value}</h3>
            <p>${card.meta}</p>
          </article>
        `
      )
      .join("");
  }

  function renderSnapshotTable() {
    const selected = getSelectedSeason();

    if (!selected) {
      elements.snapshotBody.innerHTML = `<tr><td colspan="2">${copy("archiveEmpty")}</td></tr>`;
      return;
    }

    elements.snapshotBody.innerHTML = SNAPSHOT_ROWS.map((row) => `
      <tr>
        <td>${copy(row.copyKey)}</td>
        <td>${row.type === "text" ? (selected[row.key] || copy("unknownText")) : formatMetricValue(row.key, selected[row.key])}</td>
      </tr>
    `).join("");
  }

  function renderArchiveTable() {
    const archive = getPlayerArchive(state.activePlayerId);

    if (!archive.length) {
      elements.archiveBody.innerHTML = `<tr><td colspan="15">${copy("archiveEmpty")}</td></tr>`;
      return;
    }

    elements.archiveBody.innerHTML = archive
      .map((season) => {
        const isSelected = season.id === state.selectedSeasonId;
        return `
          <tr class="peak-table-row${isSelected ? " is-selected" : ""}" tabindex="0" data-peak-archive-select="${season.id}">
            <td>${season.season}</td>
            <td>${season.club}</td>
            <td>${season.country}</td>
            <td>${season.position}</td>
            <td>${formatValue(season.appearances)}</td>
            <td>${formatValue(season.minutes)}</td>
            <td>${formatValue(season.goals)}</td>
            <td>${formatValue(season.assists)}</td>
            <td>${formatValue(season.ga)}</td>
            <td>${formatValue(season.goalsPerMatch, 2)}</td>
            <td>${formatValue(season.assistsPerMatch, 2)}</td>
            <td>${formatValue(season.gaPerMatch, 2)}</td>
            <td>${formatValue(season.goalsPer90, 2)}</td>
            <td>${formatValue(season.assistsPer90, 2)}</td>
            <td>${formatValue(season.gaPer90, 2)}</td>
          </tr>
        `;
      })
      .join("");

    elements.archiveBody.querySelectorAll("[data-peak-archive-select]").forEach((row) => {
      const handleSelect = () => {
        state.selectedSeasonId = row.dataset.peakArchiveSelect;
        render();
      };

      row.addEventListener("click", handleSelect);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      });
    });
  }

  function showTooltip(event, season, metric) {
    elements.tooltip.hidden = false;
    elements.tooltip.innerHTML = `
      <strong>${season.playerName} · ${season.season}</strong>
      <p>
        <span>${copy("tooltipMetric")}</span> ${copy(metric.copyKey)}<br />
        <span>${copy("tooltipValue")}</span> ${formatMetricValue(metric.key, season[metric.key])}<br />
        <span>${copy("tooltipClub")}</span> ${season.club}
      </p>
    `;

    const shell = elements.heatmapHost.parentElement;
    const bounds = shell.getBoundingClientRect();
    elements.tooltip.style.left = `${event.clientX - bounds.left + 18}px`;
    elements.tooltip.style.top = `${event.clientY - bounds.top + 18}px`;
  }

  function hideTooltip() {
    elements.tooltip.hidden = true;
  }

  function renderHeatmap() {
    const archive = getPlayerArchive(state.activePlayerId);
    const selected = getSelectedSeason();
    elements.heatmapHost.innerHTML = "";

    if (!archive.length) {
      elements.heatmapHost.innerHTML = `<div class="peak-heatmap-empty">${copy("archiveEmpty")}</div>`;
      return;
    }

    const seasons = [...archive];
    const metricMax = Object.fromEntries(
      HEATMAP_COLUMNS.map((column) => [
        column.key,
        d3.max(seasons, (season) => season[column.key]) || 1
      ])
    );

    const margin = { top: 30, right: 18, bottom: 20, left: 92 };
    const cellWidth = 108;
    const cellHeight = 30;
    const width = margin.left + margin.right + cellWidth * HEATMAP_COLUMNS.length;
    const height = margin.top + margin.bottom + cellHeight * seasons.length;

    const svg = d3
      .select(elements.heatmapHost)
      .append("svg")
      .attr("class", "peak-heatmap-svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", copy("peakSeasonLabel"));

    const chart = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(HEATMAP_COLUMNS.map((column) => column.key))
      .range([0, cellWidth * HEATMAP_COLUMNS.length])
      .paddingInner(0.08)
      .paddingOuter(0.02);

    const y = d3
      .scaleBand()
      .domain(seasons.map((season) => season.id))
      .range([0, cellHeight * seasons.length])
      .paddingInner(0.08)
      .paddingOuter(0.02);

    chart
      .append("g")
      .selectAll("text")
      .data(HEATMAP_COLUMNS)
      .join("text")
      .attr("class", "peak-heatmap-axis-label")
      .attr("x", (column) => x(column.key) + x.bandwidth() / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .text((column) => copy(column.copyKey));

    chart
      .append("g")
      .selectAll("text")
      .data(seasons)
      .join("text")
      .attr("class", "peak-heatmap-axis-label")
      .attr("x", -12)
      .attr("y", (season) => y(season.id) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .text((season) => season.season);

    const cells = chart
      .append("g")
      .selectAll("g")
      .data(
        seasons.flatMap((season) =>
          HEATMAP_COLUMNS.map((column) => ({
            season,
            column,
            normalized: metricMax[column.key] ? season[column.key] / metricMax[column.key] : 0
          }))
        )
      )
      .join("g");

    const fillScale = d3.scaleLinear().domain([0, 1]).range(["#edf3ff", "#0d35ff"]);

    cells
      .append("rect")
      .attr("class", (datum) =>
        `peak-heatmap-cell${selected && datum.season.id === selected.id ? " is-selected" : ""}`
      )
      .attr("x", (datum) => x(datum.column.key))
      .attr("y", (datum) => y(datum.season.id))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (datum) => fillScale(datum.normalized))
      .on("mouseenter", (event, datum) => showTooltip(event, datum.season, datum.column))
      .on("mousemove", (event, datum) => showTooltip(event, datum.season, datum.column))
      .on("mouseleave", hideTooltip)
      .on("click", (_, datum) => {
        state.selectedSeasonId = datum.season.id;
        render();
      });

    cells
      .append("text")
      .attr("class", "peak-heatmap-value")
      .attr("x", (datum) => x(datum.column.key) + x.bandwidth() / 2)
      .attr("y", (datum) => y(datum.season.id) + y.bandwidth() / 2)
      .text((datum) => formatMetricValue(datum.column.key, datum.season[datum.column.key]));
  }

  function render() {
    syncSelection();
    renderStaticCopy();
    renderLeaderCards();
    renderRankingSummary();
    renderRankingTable();
    renderDetailHeader();
    renderSummaryCards();
    renderSnapshotTable();
    renderArchiveTable();
    renderHeatmap();
  }

  function bindControls() {
    elements.limitButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.limit = button.dataset.peakLimit;
        render();
      });
    });

    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", (event) => {
        state.searchTerm = event.target.value;
        render();
      });
    }

    const observer = new MutationObserver(() => {
      const nextLang = document.documentElement.lang === "zh-CN" ? "zh" : "en";
      if (nextLang !== state.lang) {
        state.lang = nextLang;
        render();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }

  async function loadData() {
    const rows = await d3.csv(DATA_FILE, parseRow);
    state.ranking = rows.sort((left, right) => {
      if (right.ga !== left.ga) {
        return right.ga - left.ga;
      }
      if (right.goals !== left.goals) {
        return right.goals - left.goals;
      }
      if (right.assists !== left.assists) {
        return right.assists - left.assists;
      }
      return right.seasonEndYear - left.seasonEndYear;
    });

    const grouped = d3.group(state.ranking, (row) => row.playerId);
    state.dataByPlayer = new Map(
      [...grouped.entries()].map(([playerId, seasons]) => [
        playerId,
        [...seasons].sort((left, right) => {
          if (right.seasonEndYear !== left.seasonEndYear) {
            return right.seasonEndYear - left.seasonEndYear;
          }
          return right.ga - left.ga;
        })
      ])
    );

    const initial = state.ranking[0] || null;
    if (initial) {
      state.activePlayerId = initial.playerId;
      state.selectedSeasonId = initial.id;
    }
  }

  async function init() {
    collectElements();
    bindControls();

    try {
      await loadData();
      render();
    } catch (error) {
      console.error("Failed to load peak season data", error);
      if (elements.rankingSummary) {
        elements.rankingSummary.textContent = copy("archiveEmpty");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
