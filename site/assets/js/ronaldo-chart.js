(() => {
  const DATA_FILE = "assets/data/CR7_UCL_season_stage_wide_2003_2025.csv";
  const ALL_CLUB = "all";
  const ALL_SEASON = "all";
  const STAGE_SUFFIXES = [
    "final",
    "group_stage",
    "quarter_finals",
    "round_of_16",
    "semi_finals"
  ];
  const CLUB_FIELDS = STAGE_SUFFIXES.map((stage) => `club_${stage}`);
  const STAGE_PANELS = [
    { key: "group_stage", label: "Group Stage" },
    { key: "round_of_16", label: "Round of 16" },
    { key: "quarter_finals", label: "Quarter-finals" },
    { key: "semi_finals", label: "Semi-finals" },
    { key: "final", label: "Final" }
  ];

  const CLUB_STYLES = {
    "Manchester United": {
      color: "#DA291C",
      logo: "assets/logos/manchester-united.svg"
    },
    "Real Madrid": {
      color: "#F7C948",
      logo: "assets/logos/real-madrid.svg"
    },
    "Juventus FC": {
      color: "#111111",
      logo: "assets/logos/juventus.svg"
    }
  };

  const STAR_METRICS = [
    { key: "goals", label: "Goals", labelZh: "进球" },
    { key: "assists", label: "Assists", labelZh: "助攻" },
    { key: "big_chances_created", label: "Big Chances", labelZh: "重大机会" },
    { key: "shot_creating_passes", label: "Shot Passes", labelZh: "射门创造传球" },
    { key: "pass_accuracy_pct", label: "Pass Accuracy %", labelZh: "传球成功率" },
    { key: "defensive_factor", label: "Defensive", labelZh: "防守" }
  ];

  const CLUB_LABEL_ZH = {
    "Manchester United": "曼联",
    "Real Madrid": "皇家马德里",
    "Juventus FC": "尤文图斯"
  };

  function currentLang() {
    return localStorage.getItem("site_lang") === "zh" ? "zh" : "en";
  }

  function tr(enText, zhText) {
    return currentLang() === "zh" ? zhText : enText;
  }

  function clubLabel(club) {
    return currentLang() === "zh" ? CLUB_LABEL_ZH[club] || club : club;
  }

  function getClubStyle(club) {
    return CLUB_STYLES[club] || { color: "#2C4D9B", logo: "" };
  }

  function parseMaybeNumber(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function sumAcrossStages(row, metricPrefix) {
    let total = 0;
    STAGE_SUFFIXES.forEach((stage) => {
      const value = parseMaybeNumber(row[`${metricPrefix}_${stage}`]);
      if (value !== null) {
        total += value;
      }
    });
    return total;
  }

  function meanAcrossStages(row, metricPrefix) {
    let total = 0;
    let count = 0;
    STAGE_SUFFIXES.forEach((stage) => {
      const value = parseMaybeNumber(row[`${metricPrefix}_${stage}`]);
      if (value !== null) {
        total += value;
        count += 1;
      }
    });
    return count ? total / count : 0;
  }

  function extractClub(row) {
    for (const field of CLUB_FIELDS) {
      const value = (row[field] || "").trim();
      if (value) {
        return value;
      }
    }
    return "Unknown Club";
  }

  function rowParser(row) {
    const parsed = {
      season: row.season,
      club: extractClub(row),
      goals: sumAcrossStages(row, "goals"),
      assists: sumAcrossStages(row, "assists"),
      big_chances_created: sumAcrossStages(row, "big_chances_created"),
      shot_creating_passes: sumAcrossStages(row, "shot_creating_passes"),
      pass_accuracy_pct: meanAcrossStages(row, "pass_accuracy_pct"),
      defensive_factor: meanAcrossStages(row, "defensive_factor")
    };

    [
      "goals",
      "assists",
      "big_chances_created",
      "shot_creating_passes",
      "pass_accuracy_pct",
      "defensive_factor"
    ].forEach((metricKey) => {
      STAGE_SUFFIXES.forEach((stageKey) => {
        parsed[`${metricKey}_${stageKey}`] = parseMaybeNumber(row[`${metricKey}_${stageKey}`]) || 0;
      });
    });

    return parsed;
  }

  function pointsToString(points) {
    return points.map((point) => `${point[0]},${point[1]}`).join(" ");
  }

  function buildStarChart(host) {
    if (!host) {
      return null;
    }

    const width = 320;
    const height = 320;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 106;
    const levels = 5;
    const angles = STAR_METRICS.map((_, index) => (index / STAR_METRICS.length) * Math.PI * 2);

    const svg = d3
      .select(host)
      .append("svg")
      .attr("class", "cr7-star-svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    function getPoint(angle, valueScale) {
      return [
        centerX + Math.cos(angle - Math.PI / 2) * radius * valueScale,
        centerY + Math.sin(angle - Math.PI / 2) * radius * valueScale
      ];
    }

    const gridGroup = svg.append("g");
    for (let level = 1; level <= levels; level += 1) {
      const levelScale = level / levels;
      const levelPoints = angles.map((angle) => getPoint(angle, levelScale));
      gridGroup
        .append("polygon")
        .attr("class", "cr7-radar-grid")
        .attr("points", pointsToString(levelPoints));
    }

    const axisGroup = svg.append("g");
    angles.forEach((angle) => {
      const end = getPoint(angle, 1);
      axisGroup
        .append("line")
        .attr("class", "cr7-radar-axis")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", end[0])
        .attr("y2", end[1]);
    });

    const labelGroup = svg.append("g");
    const labelSelection = labelGroup
      .selectAll("text")
      .data(STAR_METRICS)
      .join("text")
      .attr("class", "cr7-radar-label")
      .attr("x", (_, index) => {
        const labelPoint = getPoint(angles[index], 1.2);
        return labelPoint[0];
      })
      .attr("y", (_, index) => {
        const labelPoint = getPoint(angles[index], 1.2);
        return labelPoint[1];
      })
      .attr("text-anchor", (_, index) => {
        const direction = Math.cos(angles[index] - Math.PI / 2);
        if (direction > 0.25) {
          return "start";
        }
        if (direction < -0.25) {
          return "end";
        }
        return "middle";
      })
      .attr("dominant-baseline", "middle");

    function updateAxisLabels() {
      labelSelection.text((metric) =>
        currentLang() === "zh" ? metric.labelZh : metric.label
      );
    }

    const baseShape = svg.append("polygon").attr("class", "cr7-radar-shape cr7-radar-shape--base");
    const focusShape = svg.append("polygon").attr("class", "cr7-radar-shape cr7-radar-shape--focus");

    const basePointsGroup = svg.append("g");
    const focusPointsGroup = svg.append("g");

    function toPoints(values) {
      return angles.map((angle, index) => getPoint(angle, values[index] || 0));
    }

    function render(baseValues, focusValues) {
      const basePoints = toPoints(baseValues);
      const focusPoints = toPoints(focusValues);

      baseShape.transition().duration(350).attr("points", pointsToString(basePoints));
      focusShape.transition().duration(350).attr("points", pointsToString(focusPoints));

      basePointsGroup
        .selectAll("circle")
        .data(basePoints)
        .join("circle")
        .attr("class", "cr7-radar-point cr7-radar-point--base")
        .attr("r", 2.6)
        .transition()
        .duration(350)
        .attr("cx", (point) => point[0])
        .attr("cy", (point) => point[1]);

      focusPointsGroup
        .selectAll("circle")
        .data(focusPoints)
        .join("circle")
        .attr("class", "cr7-radar-point")
        .attr("r", 3)
        .transition()
        .duration(350)
        .attr("cx", (point) => point[0])
        .attr("cy", (point) => point[1]);
    }

    updateAxisLabels();

    return { render, updateAxisLabels };
  }

  function getNormalizedProfile(rows, metricMax) {
    return STAR_METRICS.map((metric) => {
      const max = metricMax[metric.key] || 1;
      const mean = d3.mean(rows, (row) => row[metric.key]) || 0;
      return Math.max(0, Math.min(1, mean / max));
    });
  }

  async function initRonaldoChart() {
    const root = document.querySelector("[data-cr7-chart]");
    if (!root || !window.d3) {
      return;
    }

    const host = root.querySelector("[data-cr7-svg-host]");
    const radarHost = root.querySelector("[data-cr7-radar-host]");
    const metricSelect = root.querySelector("[data-cr7-metric]");
    const metricLabel = root.querySelector("[data-cr7-metric-label]");
    const stageMetricSelect = document.querySelector("[data-cr7-stage-metric]");
    const stageMetricLabel = document.querySelector("[data-cr7-stage-metric-label]");
    const clubSelect = root.querySelector("[data-cr7-club]");
    const seasonSelect = root.querySelector("[data-cr7-season]");
    const radarSummary = root.querySelector("[data-cr7-radar-summary]");
    const stageRoot = document.querySelector("[data-cr7-stage-charts]");

    if (!host || !metricSelect || !clubSelect || !seasonSelect) {
      return;
    }

    const data = await d3.csv(DATA_FILE, rowParser);
    if (!data.length) {
      return;
    }

    const metricMax = {};
    STAR_METRICS.forEach((metric) => {
      metricMax[metric.key] = Math.max(1, d3.max(data, (row) => row[metric.key]) || 1);
    });

    const clubs = Array.from(new Set(data.map((row) => row.club)));
    const allSeasons = Array.from(new Set(data.map((row) => row.season)));

    const starChart = buildStarChart(radarHost);
    const stageHosts = new Map();

    if (stageRoot) {
      STAGE_PANELS.forEach((stage) => {
        const hostEl = stageRoot.querySelector(`[data-stage-chart="${stage.key}"]`);
        if (hostEl) {
          stageHosts.set(stage.key, hostEl);
        }
      });
    }

    function setOptions(selectEl, options, value) {
      selectEl.innerHTML = "";
      options.forEach((option) => {
        const el = document.createElement("option");
        el.value = option.value;
        el.textContent = option.label;
        selectEl.append(el);
      });
      selectEl.value = value;
    }

    function seasonsForClub(club) {
      if (club === ALL_CLUB) {
        return allSeasons;
      }
      return allSeasons.filter((season) => data.some((row) => row.club === club && row.season === season));
    }

    function refreshSeasonOptions(club, keepSeason) {
      const seasons = seasonsForClub(club);
      const nextSeason = keepSeason && seasons.includes(keepSeason) ? keepSeason : ALL_SEASON;
      setOptions(
        seasonSelect,
        [{ value: ALL_SEASON, label: tr("All Seasons", "全部赛季") }].concat(
          seasons.map((season) => ({ value: season, label: season }))
        ),
        nextSeason
      );
      return nextSeason;
    }

    let selectedClub = ALL_CLUB;
    let selectedSeason = ALL_SEASON;
    let currentMetric = metricSelect.value || "goals";
    let currentStageMetric = stageMetricSelect ? stageMetricSelect.value || currentMetric : currentMetric;

    if (stageMetricSelect) {
      stageMetricSelect.value = currentStageMetric;
    }

    function refreshLanguageUi() {
      setOptions(
        clubSelect,
        [{ value: ALL_CLUB, label: tr("All Clubs", "全部俱乐部") }].concat(
          clubs.map((club) => ({ value: club, label: clubLabel(club) }))
        ),
        selectedClub
      );
      selectedClub = clubSelect.value || ALL_CLUB;
      selectedSeason = refreshSeasonOptions(selectedClub, selectedSeason);

      if (starChart) {
        starChart.updateAxisLabels();
      }

      updateStar();
    }

    refreshLanguageUi();

    const margin = { top: 24, right: 20, bottom: 106, left: 56 };
    const width = Math.max(980, data.length * 52 + margin.left + margin.right);
    const height = 430;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(host)
      .append("svg")
      .attr("class", "cr7-chart__svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet");

    const plot = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.season))
      .range([0, innerWidth])
      .padding(0.22);

    const y = d3.scaleLinear().range([innerHeight, 0]);
    const yAxisGroup = plot.append("g").attr("class", "cr7-axis cr7-axis--y");

    plot
      .append("line")
      .attr("class", "cr7-zero-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", innerHeight)
      .attr("y2", innerHeight);

    const barsGroup = plot.append("g").attr("class", "cr7-bars");
    const valuesGroup = plot.append("g").attr("class", "cr7-values");
    const logosGroup = plot.append("g").attr("class", "cr7-logos");
    const seasonGroup = plot.append("g").attr("class", "cr7-seasons");

    function rowMatchesFilters(row) {
      if (selectedSeason !== ALL_SEASON) {
        return row.season === selectedSeason && (selectedClub === ALL_CLUB || row.club === selectedClub);
      }
      if (selectedClub !== ALL_CLUB) {
        return row.club === selectedClub;
      }
      return true;
    }

    function updateBarFocus() {
      barsGroup
        .selectAll("rect")
        .attr("opacity", (row) => (rowMatchesFilters(row) ? 1 : 0.26))
        .attr("stroke", (row) =>
          selectedSeason !== ALL_SEASON && rowMatchesFilters(row) ? "#0c1739" : "none"
        )
        .attr("stroke-width", (row) =>
          selectedSeason !== ALL_SEASON && rowMatchesFilters(row) ? 1.3 : 0
        );

      valuesGroup
        .selectAll("text")
        .attr("opacity", (row) =>
          shouldShowBarLabel(currentMetric) ? (rowMatchesFilters(row) ? 1 : 0.35) : 0
        );
      logosGroup.selectAll("image").attr("opacity", (row) => (rowMatchesFilters(row) ? 1 : 0.28));
      seasonGroup.selectAll("text").attr("opacity", (row) => (rowMatchesFilters(row) ? 1 : 0.45));
    }

    function updateStar() {
      const scopedRows =
        selectedClub === ALL_CLUB ? data : data.filter((row) => row.club === selectedClub);

      let focusRows = scopedRows;
      let baselineRows = data;
      let summary = tr(
        "Comparing selected profile with other seasons in the current scope.",
        "当前所选画像正在与同范围内的其他赛季对比。"
      );

      if (selectedSeason !== ALL_SEASON) {
        focusRows = scopedRows.filter((row) => row.season === selectedSeason);
        baselineRows = scopedRows.filter((row) => row.season !== selectedSeason);

        if (!baselineRows.length) {
          baselineRows = data.filter((row) => row.season !== selectedSeason);
        }

        const scopeLabel =
          selectedClub === ALL_CLUB ? tr("all clubs", "全部俱乐部") : clubLabel(selectedClub);
        summary =
          currentLang() === "zh"
            ? `${selectedSeason}（${scopeLabel}）正在与同范围内的其他赛季对比。`
            : `${selectedSeason} (${scopeLabel}) compared with other seasons in the same scope.`;
      } else if (selectedClub !== ALL_CLUB) {
        baselineRows = data.filter((row) => row.club !== selectedClub);
        summary =
          currentLang() === "zh"
            ? `${clubLabel(selectedClub)}平均画像，正在与其他赛季进行对比。`
            : `${selectedClub} average profile compared with other seasons outside this club.`;
      } else {
        baselineRows = data;
        summary = tr(
          "All-season average profile. Pick a season or club to compare with other seasons.",
          "当前为全部赛季平均画像。可选择赛季或俱乐部，与其他赛季对比。"
        );
      }

      if (!focusRows.length) {
        focusRows = data;
      }
      if (!baselineRows.length) {
        baselineRows = data;
      }

      const focusProfile = getNormalizedProfile(focusRows, metricMax);
      const baselineProfile = getNormalizedProfile(baselineRows, metricMax);

      if (starChart) {
        starChart.render(baselineProfile, focusProfile);
      }

      if (radarSummary) {
        radarSummary.textContent = summary;
      }
    }

    function formatAxisTick(metric, value) {
      if (metric === "pass_accuracy_pct") {
        return `${d3.format(".0f")(value)}%`;
      }
      return d3.format("d")(Math.round(value));
    }

    function formatBarValue(metric, value) {
      if (metric === "pass_accuracy_pct") {
        return `${d3.format(".1f")(value)}%`;
      }
      return d3.format("d")(Math.round(value));
    }

    function shouldShowBarLabel(metric) {
      return metric !== "pass_accuracy_pct";
    }

    function updateStageMetricLabel() {
      if (!stageMetricLabel) {
        return;
      }
      if (stageMetricSelect) {
        const opt = stageMetricSelect.options[stageMetricSelect.selectedIndex];
        stageMetricLabel.textContent = opt ? opt.textContent : "Goals";
      } else {
        stageMetricLabel.textContent = metricLabel ? metricLabel.textContent : "Goals";
      }
    }

    function renderStageCharts(metric) {
      if (!stageHosts.size) {
        return;
      }

      STAGE_PANELS.forEach((stage) => {
        const hostEl = stageHosts.get(stage.key);
        if (!hostEl) {
          return;
        }

        hostEl.innerHTML = "";

        const margin = { top: 12, right: 10, bottom: 46, left: 44 };
        const width = 420;
        const height = 220;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const stageData = data.map((row) => ({
          ...row,
          value: row[`${metric}_${stage.key}`] || 0
        }));

        const x = d3
          .scaleBand()
          .domain(stageData.map((d) => d.season))
          .range([0, innerWidth])
          .padding(0.22);

        const maxValue = d3.max(stageData, (d) => d.value) || 0;
        const y = d3.scaleLinear().domain([0, Math.max(1, maxValue)]).nice().range([innerHeight, 0]);

        const svg = d3
          .select(hostEl)
          .append("svg")
          .attr("class", "stage-chart__svg")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMinYMin meet");

        const plot = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        plot
          .append("g")
          .attr("class", "stage-chart__axis stage-chart__axis--y")
          .call(
            d3
              .axisLeft(y)
              .ticks(5)
              .tickSize(-innerWidth)
              .tickFormat((value) => formatAxisTick(metric, value))
          )
          .call((axis) => axis.select(".domain").remove());

        const tickStep = Math.max(1, Math.ceil(stageData.length / 8));
        const tickSeasons = stageData
          .map((row, index) => ({ season: row.season, index }))
          .filter((entry, index) => index % tickStep === 0 || index === stageData.length - 1)
          .map((entry) => entry.season);

        const xAxis = plot
          .append("g")
          .attr("class", "stage-chart__axis stage-chart__axis--x")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(d3.axisBottom(x).tickValues(tickSeasons).tickSizeOuter(0));

        xAxis
          .selectAll("text")
          .attr("transform", "rotate(-35)")
          .attr("text-anchor", "end")
          .attr("dx", "-0.45em")
          .attr("dy", "0.5em");

        plot
          .selectAll("rect")
          .data(stageData)
          .join("rect")
          .attr("x", (d) => x(d.season))
          .attr("y", (d) => y(d.value))
          .attr("width", x.bandwidth())
          .attr("height", (d) => innerHeight - y(d.value))
          .attr("fill", (d) => getClubStyle(d.club).color)
          .attr("opacity", (d) => (rowMatchesFilters(d) ? 1 : 0.28));

        plot
          .selectAll(".stage-chart__value")
          .data(stageData)
          .join("text")
          .attr("class", "stage-chart__value")
          .attr("x", (d) => x(d.season) + x.bandwidth() / 2)
          .attr("y", (d) => (d.value > 0 ? y(d.value) - 5 : innerHeight - 4))
          .text((d) => (shouldShowBarLabel(metric) ? formatBarValue(metric, d.value) : ""))
          .attr("opacity", (d) =>
            shouldShowBarLabel(metric) ? (rowMatchesFilters(d) ? 1 : 0.35) : 0
          );
      });
    }

    function render(metric) {
      currentMetric = metric;
      const maxValue = d3.max(data, (d) => d[metric]) || 0;
      y.domain([0, Math.max(1, maxValue)]).nice();

      yAxisGroup.call(
        d3
          .axisLeft(y)
          .ticks(6)
          .tickSize(-innerWidth)
          .tickFormat((value) => formatAxisTick(metric, value))
      );
      yAxisGroup.select(".domain").remove();

      const bars = barsGroup.selectAll("rect").data(data, (d) => d.season);

      bars
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("x", (d) => x(d.season))
              .attr("y", innerHeight)
              .attr("width", x.bandwidth())
              .attr("height", 0)
              .attr("fill", (d) => getClubStyle(d.club).color)
              .attr("rx", 3)
              .call((enterSel) =>
                enterSel
                  .transition()
                  .duration(650)
                  .attr("y", (d) => y(d[metric]))
                  .attr("height", (d) => innerHeight - y(d[metric]))
              ),
          (update) =>
            update.call((updateSel) =>
              updateSel
                .transition()
                .duration(450)
                .attr("x", (d) => x(d.season))
                .attr("width", x.bandwidth())
                .attr("fill", (d) => getClubStyle(d.club).color)
                .attr("y", (d) => y(d[metric]))
                .attr("height", (d) => innerHeight - y(d[metric]))
            )
        );

      const values = valuesGroup.selectAll("text").data(data, (d) => d.season);

      values
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "cr7-bar-value")
              .attr("x", (d) => x(d.season) + x.bandwidth() / 2)
              .attr("y", innerHeight - 6)
              .text((d) => (shouldShowBarLabel(metric) ? formatBarValue(metric, d[metric]) : ""))
              .call((enterSel) =>
                enterSel
                  .transition()
                  .duration(650)
                  .attr("y", (d) => y(d[metric]) - 8)
              ),
          (update) =>
            update
              .text((d) => (shouldShowBarLabel(metric) ? formatBarValue(metric, d[metric]) : ""))
              .call((updateSel) =>
                updateSel
                  .transition()
                  .duration(450)
                  .attr("x", (d) => x(d.season) + x.bandwidth() / 2)
                  .attr("y", (d) => y(d[metric]) - 8)
              )
        );

      const logos = logosGroup.selectAll("image").data(data, (d) => d.season);

      logos
        .join(
          (enter) =>
            enter
              .append("image")
              .attr("class", "cr7-logo")
              .attr("href", (d) => getClubStyle(d.club).logo)
              .attr("x", (d) => x(d.season) + x.bandwidth() / 2 - 12)
              .attr("y", innerHeight + 12)
              .attr("width", 24)
              .attr("height", 24),
          (update) =>
            update
              .attr("href", (d) => getClubStyle(d.club).logo)
              .attr("x", (d) => x(d.season) + x.bandwidth() / 2 - 12)
        );

      const seasons = seasonGroup.selectAll("text").data(data, (d) => d.season);

      seasons
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "cr7-season-label")
              .attr("x", (d) => x(d.season) + x.bandwidth() / 2)
              .attr("y", innerHeight + 50)
              .text((d) => d.season),
          (update) => update.attr("x", (d) => x(d.season) + x.bandwidth() / 2)
        )
        .text((d) => d.season);

      if (metricLabel) {
        const selectedOption = metricSelect.options[metricSelect.selectedIndex];
        metricLabel.textContent = selectedOption ? selectedOption.textContent : "Goals";
      }

      updateBarFocus();
      renderStageCharts(currentStageMetric);
      updateStageMetricLabel();
    }

    metricSelect.addEventListener("change", (event) => {
      render(event.target.value);
    });

    if (stageMetricSelect) {
      stageMetricSelect.addEventListener("change", (event) => {
        currentStageMetric = event.target.value;
        renderStageCharts(currentStageMetric);
        updateStageMetricLabel();
      });
    }

    clubSelect.addEventListener("change", () => {
      selectedClub = clubSelect.value;
      selectedSeason = refreshSeasonOptions(selectedClub, selectedSeason);
      updateBarFocus();
      updateStar();
      renderStageCharts(currentMetric);
    });

    seasonSelect.addEventListener("change", () => {
      selectedSeason = seasonSelect.value;
      updateBarFocus();
      updateStar();
      renderStageCharts(currentMetric);
    });

    const langToggle = document.querySelector("[data-lang-toggle]");
    if (langToggle) {
      langToggle.addEventListener("click", () => {
        window.requestAnimationFrame(() => {
          refreshLanguageUi();
          render(currentMetric);
        });
      });
    }

    render(currentMetric);
    updateStar();
    updateStageMetricLabel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRonaldoChart);
  } else {
    initRonaldoChart();
  }
})();
