import { expect, type Locator, type Page } from "@playwright/test";

function withAppPath(baseURL: string, pathname: string): string {
  const url = new URL(baseURL);
  const basePath = url.pathname.replace(/\/+$/, "");
  url.pathname = `${basePath}${pathname}`.replace(/\/{2,}/g, "/");
  return url.toString();
}

export type SeatId = "host" | "alice" | "bob" | "carol";
type SingleplayerSeatRef = {
  id: SeatId;
  controller: {
    currentSync: () => {
      submissions: Array<{
        id: string;
        playerName: string;
      }>;
    };
    startNextRound: () => Promise<void>;
    state: {
      host: {
        state: {
          submissionDeadlineAt: number | null;
          submissions: Array<{
            id: string;
            playerId: string;
          }>;
          players: Array<{
            id: string;
            username: string;
          }>;
        };
      } | null;
    };
  };
};

type SingleplayerWindow = Window & {
  __singleplayerSeats?: SingleplayerSeatRef[];
};

export function seat(page: Page, seatId: SeatId): Locator {
  return page.getByTestId(`dev-seat-${seatId}`);
}

export async function openSingleplayer(
  page: Page,
  baseURL: string
): Promise<void> {
  await page.goto(withAppPath(baseURL, "/dev/singleplayer"));

  await expect(seat(page, "host")).toBeVisible();
  await expect(seat(page, "alice")).toBeVisible();
  await expect(seat(page, "bob")).toBeVisible();
  await expect(seat(page, "carol")).toBeVisible();
}

export async function expectSeatState(
  root: Locator,
  username: string,
  state: string
): Promise<void> {
  const article = root.locator("article.seat").filter({
    has: root.getByTestId("seat-name").filter({ hasText: username })
  });

  await expect(article.getByTestId("seat-state")).toContainText(state);
}

export async function startSingleplayerRound(page: Page): Promise<void> {
  await seat(page, "host").getByTestId("start-game").click();
  await expect(seat(page, "host").getByTestId("black-card")).toContainText(
    "Round 1"
  );
}

export async function startNextSingleplayerRound(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const singleplayerWindow = window as SingleplayerWindow;
    const host = singleplayerWindow.__singleplayerSeats?.find(
      (seat) => seat.id === "host"
    );

    if (!host) {
      throw new Error("Missing singleplayer host seat.");
    }

    await host.controller.startNextRound();
  });
}

export async function expireSingleplayerSubmissionTimer(
  page: Page
): Promise<void> {
  await page.evaluate(() => {
    const singleplayerWindow = window as SingleplayerWindow;
    const host = singleplayerWindow.__singleplayerSeats?.find(
      (seat) => seat.id === "host"
    );

    if (!host?.controller.state.host) {
      throw new Error("Missing singleplayer host runtime.");
    }

    host.controller.state.host.state.submissionDeadlineAt = Date.now() - 1;
  });
  await page.waitForTimeout(1_100);
}

export async function refreshSingleplayerSubmissionTimer(
  page: Page,
  milliseconds = 30_000
): Promise<void> {
  await page.evaluate((timeoutMs) => {
    const singleplayerWindow = window as SingleplayerWindow;
    const host = singleplayerWindow.__singleplayerSeats?.find(
      (seat) => seat.id === "host"
    );

    if (!host?.controller.state.host) {
      throw new Error("Missing singleplayer host runtime.");
    }

    host.controller.state.host.state.submissionDeadlineAt =
      Date.now() + timeoutMs;
  }, milliseconds);
}

export async function pickFirstSubmission(root: Locator): Promise<void> {
  await root
    .getByTestId("submission-choice")
    .first()
    .evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
}

export async function pickSubmissionForPlayer(
  page: Page,
  judgeSeatId: SeatId,
  playerName: string
): Promise<void> {
  const submissionIndex = await page.evaluate(
    ({ judgeSeatId: targetSeatId, playerName: targetPlayerName }) => {
      const singleplayerWindow = window as SingleplayerWindow;
      const judgeSeat = singleplayerWindow.__singleplayerSeats?.find(
        (seat) => seat.id === targetSeatId
      );
      const hostSeat = singleplayerWindow.__singleplayerSeats?.find(
        (seat) => seat.id === "host"
      );

      if (!judgeSeat) {
        throw new Error(`Missing singleplayer seat ${targetSeatId}.`);
      }

      const hostState =
        judgeSeat.controller.state.host?.state ??
        hostSeat?.controller.state.host?.state;
      if (!hostState) {
        return judgeSeat.controller
          .currentSync()
          .submissions.findIndex(
            (submission) => submission.playerName === targetPlayerName
          );
      }

      const playerId =
        hostState.players.find((player) => player.username === targetPlayerName)
          ?.id ?? null;
      if (!playerId) {
        return -1;
      }

      return hostState.submissions.findIndex(
        (submission) => submission.playerId === playerId
      );
    },
    { judgeSeatId, playerName }
  );

  if (submissionIndex < 0) {
    throw new Error(`Missing submission for player ${playerName}.`);
  }

  await seat(page, judgeSeatId)
    .getByTestId("submission-choice")
    .nth(submissionIndex)
    .evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
}

export async function revealAllSubmissions(root: Locator): Promise<void> {
  const count = await root.getByTestId("submission-choice").count();
  for (let index = 0; index < count; index += 1) {
    await root
      .getByTestId("submission-choice")
      .nth(index)
      .evaluate((button) => {
        (button as HTMLButtonElement).click();
      });
  }
}

export async function raiseFirstCards(
  root: Locator,
  count: number
): Promise<void> {
  const cards = root.getByTestId("hand-card");
  let raised = 0;
  const total = await cards.count();

  for (let index = 0; index < total && raised < count; index += 1) {
    const card = cards.nth(index);
    if (await card.isDisabled()) {
      continue;
    }

    await card.click();
    raised += 1;
  }

  if (raised !== count) {
    throw new Error(`Could not raise ${count} enabled card(s).`);
  }
}

export async function waitForRaisedCards(
  root: Locator,
  count: number
): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    const card = root.getByTestId("hand-card").nth(index);
    await expect(card).toHaveClass(/raised/);
  }

  // Let the raised transition settle before taking the screenshot.
  await root.page().waitForTimeout(250);
}

export async function waitForAnimationsToFinish(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const animations = document
      .getAnimations({ subtree: true })
      .filter((animation) => {
        if (animation.playState === "finished") {
          return false;
        }

        const timing = animation.effect?.getComputedTiming();
        return timing?.iterations !== Infinity;
      });

    await Promise.allSettled(
      animations.map((animation) => animation.finished.catch(() => undefined))
    );
  });
  await page.waitForTimeout(50);
}

export async function waitForBoardTransitionsToFinish(
  page: Page
): Promise<void> {
  await expect(page.locator(".table-transition-overlay")).toHaveCount(0);
}

export async function expectRaisedCardCount(
  root: Locator,
  count: number
): Promise<void> {
  await expect(root.locator(".hand-grid .card.raised")).toHaveCount(count);
}

export async function expectRaisedCardAtIndex(
  root: Locator,
  index: number
): Promise<void> {
  const cards = root.getByTestId("hand-card");
  const count = await cards.count();

  for (let cardIndex = 0; cardIndex < count; cardIndex += 1) {
    const card = cards.nth(cardIndex);
    if (cardIndex === index) {
      await expect(card).toHaveClass(/raised/);
    } else {
      await expect(card).not.toHaveClass(/raised/);
    }
  }
}
