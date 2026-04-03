#!/usr/bin/env python3

import csv
import time
from pathlib import Path

import requests


OUTPUT_PATH = Path("site/assets/data/ucl_player_season_totals_2003_2025.csv")
SEASON_END_YEARS = range(2003, 2026)
LIMIT = 200
RETRIES = 3
BASE_URL = "https://compstats.uefa.com/v1/player-ranking"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
}
STATS = [
    "minutes_played_official",
    "matches_appearance",
    "goals",
    "assists",
]


def season_label(end_year: int) -> str:
    return f"{str(end_year - 1)[-2:]}/{str(end_year)[-2:]}"


def stat_value(item: dict, name: str) -> float:
    for stat in item.get("statistics", []):
      if stat.get("name") == name:
          try:
              return float(stat.get("value", 0) or 0)
          except (TypeError, ValueError):
              return 0.0
    return 0.0


def fetch_page(season_year: int, offset: int) -> list[dict]:
    params = {
        "competitionId": 1,
        "limit": LIMIT,
        "offset": offset,
        "optionalFields": "PLAYER,TEAM",
        "order": "DESC",
        "phase": "TOURNAMENT",
        "seasonYear": season_year,
        "stats": ",".join(STATS),
    }

    last_error = None
    for attempt in range(RETRIES):
        try:
            response = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=25)
            response.raise_for_status()
            return response.json()
        except Exception as error:  # noqa: BLE001
            last_error = error
            time.sleep(1.5 * (attempt + 1))

    raise RuntimeError(
        f"Failed to fetch season {season_year} offset {offset}: {last_error}"
    ) from last_error


def build_rows() -> list[dict]:
    rows: list[dict] = []

    for season_year in SEASON_END_YEARS:
        offset = 0
        while True:
            payload = fetch_page(season_year, offset)
            if not payload:
                break

            for item in payload:
                player = item.get("player", {})
                team = item.get("team", {})
                appearances = stat_value(item, "matches_appearance")
                goals = stat_value(item, "goals")
                assists = stat_value(item, "assists")
                minutes = stat_value(item, "minutes_played_official")
                ga = goals + assists

                rows.append(
                    {
                        "season_end_year": season_year,
                        "season": season_label(season_year),
                        "player_id": item.get("playerId") or player.get("id") or "",
                        "player_name": player.get("internationalName") or "",
                        "player_short_name": (
                            player.get("translations", {})
                            .get("shortName", {})
                            .get("EN", "")
                        ),
                        "country": (
                            player.get("translations", {})
                            .get("countryName", {})
                            .get("EN", "")
                        ),
                        "position": (
                            player.get("translations", {})
                            .get("fieldPosition", {})
                            .get("EN", "")
                        ),
                        "club": team.get("internationalName") or "",
                        "club_display_name": (
                            team.get("translations", {})
                            .get("displayName", {})
                            .get("EN", "")
                        ),
                        "appearances": int(appearances),
                        "minutes": int(minutes),
                        "goals": int(goals),
                        "assists": int(assists),
                        "ga": int(ga),
                        "goals_per_match": round(goals / appearances, 3) if appearances else 0,
                        "assists_per_match": round(assists / appearances, 3) if appearances else 0,
                        "ga_per_match": round(ga / appearances, 3) if appearances else 0,
                        "goals_per_90": round(goals * 90 / minutes, 3) if minutes else 0,
                        "assists_per_90": round(assists * 90 / minutes, 3) if minutes else 0,
                        "ga_per_90": round(ga * 90 / minutes, 3) if minutes else 0,
                    }
                )

            offset += LIMIT
            if len(payload) < LIMIT:
                break

    rows.sort(key=lambda row: (row["ga"], row["goals"], row["assists"], row["season_end_year"]), reverse=True)
    return rows


def main() -> None:
    rows = build_rows()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
