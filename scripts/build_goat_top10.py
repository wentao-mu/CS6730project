#!/usr/bin/env python3

import csv
import json
import re
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "site/assets/data/goat_top10.json"
GOALS_JS_PATH = ROOT / "site/assets/js/goals.js"
ASSISTS_HTML_PATH = ROOT / "site/assists.html"
TITLES_HTML_PATH = ROOT / "site/trophies.html"
APPEARANCES_HTML_PATH = ROOT / "site/appearances.html"
BEST_XI_HTML_PATH = ROOT / "site/bestxi.html"
PEAK_CSV_PATH = ROOT / "site/assets/data/ucl_player_season_totals_2003_2025.csv"

WEIGHTS = {
    "goals": 0.25,
    "assists": 0.15,
    "knockout": 0.20,
    "titles": 0.15,
    "appearances": 0.10,
    "bestxi": 0.10,
    "peak": 0.05,
}

METRICS = [
    {"key": "goals", "value_key": "Goals"},
    {"key": "assists", "value_key": "Assists"},
    {"key": "knockout", "value_key": "Knockout G+A"},
    {"key": "titles", "value_key": "Titles"},
    {"key": "appearances", "value_key": "Appearances"},
    {"key": "bestxi", "value_key": "UEFA Best XI"},
    {"key": "peak", "value_key": "Peak"},
]

# The local knockout page is a Ronaldo/Messi head-to-head. To keep the homepage
# leaderboard aligned with an all-time knockout ranking, this list is taken from
# the Opta Analyst graphic "most goals and assists in knockout stages of UCL"
# published in March 2026.
KNOCKOUT_ROWS = [
    {"rank": "1", "player": "Cristiano Ronaldo", "value": 82},
    {"rank": "2", "player": "Lionel Messi", "value": 61},
    {"rank": "3", "player": "Robert Lewandowski", "value": 44},
    {"rank": "4", "player": "Karim Benzema", "value": 41},
    {"rank": "5", "player": "Thomas Müller", "value": 40},
    {"rank": "6", "player": "Kylian Mbappé", "value": 28},
    {"rank": "6", "player": "Vinícius Júnior", "value": 28},
    {"rank": "8", "player": "Raúl", "value": 25},
    {"rank": "9", "player": "Kevin De Bruyne", "value": 24},
]

ALIASES = {
    "andres iniesta": "Andrés Iniesta",
    "angel di maria": "Ángel Di María",
    "kylian mbappe": "Kylian Mbappé",
    "luka modric": "Luka Modrić",
    "raul": "Raúl",
    "raul gonzalez": "Raúl",
    "thomas muller": "Thomas Müller",
    "vinicius junior": "Vinícius Júnior",
    "xavi hernandez": "Xavi Hernández",
}


def normalize_name(name: str) -> str:
    normalized = unicodedata.normalize("NFKD", name)
    stripped = "".join(char for char in normalized if not unicodedata.combining(char))
    lowered = stripped.lower().replace("’", "'")
    return re.sub(r"[^a-z0-9]+", " ", lowered).strip()


def canonical_name(name: str) -> str:
    compact = " ".join(name.split())
    return ALIASES.get(normalize_name(compact), compact)


def score_from_rank(rank_text: str) -> int:
    match = re.match(r"(\d+)", rank_text.strip())
    if not match:
        return 0
    rank = int(match.group(1))
    return max(105 - 5 * rank, 0)


def read_goals_rows() -> list[dict]:
    text = GOALS_JS_PATH.read_text(encoding="utf-8")
    matches = re.findall(
        r'\{\s*rank:\s*"([^"]+)",\s*player:\s*"([^"]+)",\s*goals:\s*(\d+)\s*\}',
        text,
    )
    return [{"rank": rank, "player": player, "value": int(goals)} for rank, player, goals in matches]


def read_html_table_rows(path: Path) -> list[dict]:
    html = path.read_text(encoding="utf-8")
    matches = re.findall(r"<tr>\s*<td>([^<]+)</td>\s*<td>([^<]+)</td>\s*<td>([^<]+)</td>", html)
    rows = []
    for rank, player, value in matches:
        rows.append(
            {
                "rank": rank.strip(),
                "player": player.strip(),
                "value": int(re.sub(r"[^0-9]", "", value) or 0),
            }
        )
    return rows


def empty_metric() -> dict:
    return {"rank": None, "points": 0, "value": None}


def seed_player(players: dict[str, dict], name: str) -> dict:
    canonical = canonical_name(name)
    if canonical not in players:
        players[canonical] = {
            "name": canonical,
            "score": 0,
            "metrics": {metric["key"]: empty_metric() for metric in METRICS},
        }
    return players[canonical]


def apply_rows(players: dict[str, dict], metric_key: str, rows: list[dict]) -> None:
    for row in rows:
        player = seed_player(players, row["player"])
        metric = player["metrics"][metric_key]
        points = score_from_rank(row["rank"])
        if points >= metric["points"]:
            metric["rank"] = row["rank"]
            metric["points"] = points
            metric["value"] = row["value"]


def apply_peak_rows(players: dict[str, dict]) -> None:
    best_by_player: dict[str, dict] = {}

    with PEAK_CSV_PATH.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            player_name = canonical_name(row["player_name"])
            season = row["season"]
            ga = int(row["ga"])
            current = best_by_player.get(player_name)
            if current is None or ga > current["value"]:
                best_by_player[player_name] = {"value": ga, "season": season}

    ranked = sorted(best_by_player.items(), key=lambda item: (item[1]["value"], item[0]), reverse=True)
    for idx, (player_name, peak) in enumerate(ranked, start=1):
        player = seed_player(players, player_name)
        player["metrics"]["peak"] = {
            "rank": str(idx),
            "points": score_from_rank(str(idx)),
            "value": peak["value"],
            "season": peak["season"],
        }


def build_dataset() -> dict:
    players: dict[str, dict] = {}

    apply_rows(players, "goals", read_goals_rows())
    apply_rows(players, "assists", read_html_table_rows(ASSISTS_HTML_PATH))
    apply_rows(players, "titles", read_html_table_rows(TITLES_HTML_PATH))
    apply_rows(players, "appearances", read_html_table_rows(APPEARANCES_HTML_PATH))
    apply_rows(players, "bestxi", read_html_table_rows(BEST_XI_HTML_PATH))
    apply_rows(players, "knockout", KNOCKOUT_ROWS)
    apply_peak_rows(players)

    for player in players.values():
        player["score"] = round(
            sum(player["metrics"][metric["key"]]["points"] * WEIGHTS[metric["key"]] for metric in METRICS),
            2,
        )

    ranked_players = sorted(players.values(), key=lambda item: (item["score"], item["name"]), reverse=True)
    top_players = ranked_players[:10]

    for idx, player in enumerate(top_players, start=1):
        player["overall_rank"] = idx

    average_points = {}
    for metric in METRICS:
        metric_key = metric["key"]
        average_points[metric_key] = round(
            sum(player["metrics"][metric_key]["points"] for player in top_players) / len(top_players),
            2,
        )

    return {
        "generated_at": "2026-04-03",
        "weights": WEIGHTS,
        "metrics": METRICS,
        "players": top_players,
        "top10_average_points": average_points,
        "notes": [
            "Scores use the current ranking pages in this project. Players outside a page's published cutoff receive 0 points for that metric.",
            "Knockout G+A uses the March 2026 Opta Analyst all-time knockout chart because the local knockout page is head-to-head only.",
        ],
    }


def main() -> None:
    dataset = build_dataset()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(dataset, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
