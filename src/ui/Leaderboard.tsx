import { For, Show, createMemo, type Accessor, type JSX } from "solid-js";

import type { SyncView } from "../types.js";

type LeaderboardProps = {
  sync: Accessor<SyncView>;
};

export function Leaderboard(props: LeaderboardProps): JSX.Element {
  const rankedPlayers = createMemo(() =>
    [...props.sync().players].sort(
      (left, right) =>
        right.score - left.score ||
        left.username.localeCompare(right.username) ||
        left.id.localeCompare(right.id)
    )
  );

  return (
    <Show when={(props.sync().winnerPlayerIds ?? []).length > 0}>
      <section data-testid="leaderboard" class="leaderboard">
        <div class="leaderboard-header">Scores</div>
        <div class="leaderboard-list">
          <For each={rankedPlayers()}>
            {(player) => (
              <div
                class={`leaderboard-row ${(props.sync().winnerPlayerIds ?? []).includes(player.id) ? "leaderboard-row-winner" : ""}`}
              >
                <span class="leaderboard-name">{player.username}</span>
                <span class="leaderboard-score">{player.score}</span>
              </div>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}
