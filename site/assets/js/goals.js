(() => {
  const SCORERS = [
    { rank: "1", player: "Cristiano Ronaldo", goals: 140 },
    { rank: "2", player: "Lionel Messi", goals: 129 },
    { rank: "3", player: "Robert Lewandowski", goals: 105 },
    { rank: "4", player: "Karim Benzema", goals: 90 },
    { rank: "5", player: "Raul Gonzalez", goals: 71 },
    { rank: "6", player: "Ruud van Nistelrooy", goals: 56 },
    { rank: "7", player: "Thomas Muller", goals: 56 },
    { rank: "8=", player: "Kylian Mbappe", goals: 55 },
    { rank: "8=", player: "Thierry Henry", goals: 55 },
    { rank: "10", player: "Erling Haaland", goals: 49 },
    { rank: "11=", player: "Zlatan Ibrahimovic", goals: 48 },
    { rank: "11=", player: "Andriy Shevchenko", goals: 48 },
    { rank: "13=", player: "Filippo Inzaghi", goals: 46 },
    { rank: "13=", player: "Eusebio", goals: 46 },
    { rank: "13=", player: "Didier Drogba", goals: 46 },
    { rank: "16=", player: "Neymar", goals: 43 },
    { rank: "16=", player: "Antoine Griezmann", goals: 43 },
    { rank: "18", player: "Alessandro Del Piero", goals: 42 },
    { rank: "19=", player: "Sergio Aguero", goals: 41 },
    { rank: "19=", player: "Ferenc Puskas", goals: 41 }
  ];

  const COPY = {
    en: {
      top10: "Showing top 10 players (all-time goals).",
      top20: "Showing top 20 players (all-time goals)."
    },
    zh: {
      top10: "当前显示前10名（欧冠历史进球）。",
      top20: "当前显示前20名（欧冠历史进球）。"
    }
  };

  const tableBody = document.querySelector("[data-goals-table-body]");
  const summary = document.querySelector("[data-goals-summary]");
  const buttons = Array.from(document.querySelectorAll("[data-goals-limit]"));

  if (!tableBody || buttons.length === 0) {
    return;
  }

  const maxGoals = SCORERS[0].goals;

  const getLang = () =>
    document.documentElement.lang &&
    document.documentElement.lang.toLowerCase().startsWith("zh")
      ? "zh"
      : "en";

  function setActive(limit) {
    buttons.forEach((button) => {
      const active = Number(button.dataset.goalsLimit) === limit;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function render(limit) {
    const rows = SCORERS.slice(0, limit);

    tableBody.innerHTML = rows
      .map((row) => {
        const ratio = Math.max(4, (row.goals / maxGoals) * 100);
        return `
          <tr>
            <td>${row.rank}</td>
            <td>${row.player}</td>
            <td>${row.goals}</td>
            <td><span class="goal-bar"><span style="width:${ratio.toFixed(1)}%"></span></span></td>
          </tr>
        `;
      })
      .join("");

    const copy = COPY[getLang()];
    if (summary) {
      summary.textContent = limit === 20 ? copy.top20 : copy.top10;
    }
    setActive(limit);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const limit = Number(button.dataset.goalsLimit);
      render(limit === 20 ? 20 : 10);
    });
  });

  const langToggle = document.querySelector("[data-lang-toggle]");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      window.requestAnimationFrame(() => {
        const active =
          document.querySelector("[data-goals-limit].is-active") || buttons[0];
        const limit = Number(active.dataset.goalsLimit) === 20 ? 20 : 10;
        render(limit);
      });
    });
  }

  render(10);
})();
