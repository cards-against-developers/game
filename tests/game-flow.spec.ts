import { expect, test } from "@playwright/test";

import {
  expireSingleplayerSubmissionTimer,
  expectRaisedCardCount,
  openSingleplayer,
  pickSubmissionForPlayer,
  refreshSingleplayerSubmissionTimer,
  raiseFirstCards,
  seat,
  startSingleplayerRound,
  waitForAnimationsToFinish,
  waitForBoardTransitionsToFinish
} from "./singleplayer.page.js";

test.use({
  viewport: {
    width: 3200,
    height: 2400
  }
});
test.setTimeout(120_000);

async function expectSubmissionChoicesNotToContain(
  root: ReturnType<typeof seat>,
  value: string
): Promise<void> {
  await expect
    .poll(async () =>
      (await root.getByTestId("submission-choice").allTextContents()).join("\n")
    )
    .not.toContain(value);
}

async function expectHandCardGone(
  root: ReturnType<typeof seat>,
  cardText: string | null
): Promise<void> {
  await expect
    .poll(
      async () => await root.getByTestId("hand-card-copy").allTextContents()
    )
    .toHaveLength(6);
  if (cardText) {
    await expect(root.getByTestId("hand-grid")).not.toContainText(cardText);
  }
}

test("singleplayer submits cards on first click, reveals them, and resolves host-driven rounds", async ({
  page,
  baseURL
}) => {
  const takeScreenshot = async (name: string) => {
    await waitForAnimationsToFinish(page);
    await waitForBoardTransitionsToFinish(page);
    await expect(page).toHaveScreenshot(name);
  };

  await page.addInitScript(() => {
    const fixedNow = 1_760_000_000_000;
    Date.now = () => fixedNow;
  });

  // Boot the hidden four-seat route and wait for the isolated local table.
  await openSingleplayer(page, baseURL!);

  const host = seat(page, "host");
  const alice = seat(page, "alice");
  const bob = seat(page, "bob");
  const carol = seat(page, "carol");

  // Lobby: only the host can start the round from the center black card.
  await expect(host.getByTestId("start-game")).toBeVisible();
  await expect(alice.getByTestId("start-game")).toHaveCount(0);
  await expect(bob.getByTestId("start-game")).toHaveCount(0);
  await expect(carol.getByTestId("start-game")).toHaveCount(0);
  await takeScreenshot("01-singleplayer-lobby.png");

  // Round 1: every player submits a card immediately on click before the automatic reveal phase.
  await startSingleplayerRound(page);
  await refreshSingleplayerSubmissionTimer(page);
  await expect(host.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(alice.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(bob.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(carol.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(host.getByTestId("hand-card")).toHaveCount(7);
  await expect(alice.getByTestId("hand-card")).toHaveCount(7);
  await expect(bob.getByTestId("hand-card")).toHaveCount(7);
  await expect(carol.getByTestId("hand-card")).toHaveCount(7);
  await takeScreenshot("02-singleplayer-round-start.png");

  // Submission previews: each player commits a card immediately on click.
  const hostFirstHandCardText = await host
    .getByTestId("hand-card-copy")
    .first()
    .textContent();
  await raiseFirstCards(host, 1);
  await refreshSingleplayerSubmissionTimer(page);
  await expect(host.getByTestId("submission-choice")).toHaveCount(1);
  await expect(host.getByTestId("hand-card")).toHaveCount(6);
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await takeScreenshot("03-singleplayer-round-one-alice-raised.png");

  const aliceFirstHandCardText = await alice
    .getByTestId("hand-card-copy")
    .first()
    .textContent();
  await raiseFirstCards(alice, 1);
  await refreshSingleplayerSubmissionTimer(page);
  await expect(host.getByTestId("submission-choice")).toHaveCount(2);
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await takeScreenshot("04-singleplayer-round-one-bob-raised.png");

  const bobFirstHandCardText = await bob
    .getByTestId("hand-card-copy")
    .first()
    .textContent();
  await raiseFirstCards(bob, 1);
  await refreshSingleplayerSubmissionTimer(page);
  await expect(host.getByTestId("submission-choice")).toHaveCount(3);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await takeScreenshot("05-singleplayer-round-one-carol-raised.png");

  const carolFirstHandCardText = await carol
    .getByTestId("hand-card-copy")
    .first()
    .textContent();
  await raiseFirstCards(carol, 1);
  await refreshSingleplayerSubmissionTimer(page);
  await expect(host.getByTestId("submission-choice")).toHaveCount(4);
  await expect(host.getByTestId("board-status")).toContainText(
    "Revealing cards"
  );
  await expect(alice.getByTestId("board-status")).toContainText(
    "Revealing cards"
  );
  await expect(alice.getByTestId("submission-choice").first()).toBeDisabled();
  await expectRaisedCardCount(host, 0);
  await expectRaisedCardCount(alice, 0);
  await expectRaisedCardCount(bob, 0);
  await expectRaisedCardCount(carol, 0);
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await expectHandCardGone(carol, carolFirstHandCardText);
  await takeScreenshot("06-singleplayer-round-one-countdown.png");

  // Reveal flow: the host reveals submissions automatically one at a time.
  await expireSingleplayerSubmissionTimer(page);
  await expect(host.locator(".submission-card-hidden")).toHaveCount(3);
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await expectHandCardGone(carol, carolFirstHandCardText);
  await takeScreenshot("07-singleplayer-round-one-first-reveal.png");

  await expireSingleplayerSubmissionTimer(page);
  await expect(host.locator(".submission-card-hidden")).toHaveCount(2);
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await expectHandCardGone(carol, carolFirstHandCardText);
  await takeScreenshot("08-singleplayer-round-one-second-reveal.png");

  await expireSingleplayerSubmissionTimer(page);
  await expect(host.locator(".submission-card-hidden")).toHaveCount(1);
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await expectHandCardGone(carol, carolFirstHandCardText);
  await takeScreenshot("09-singleplayer-round-one-all-revealed.png");

  await expireSingleplayerSubmissionTimer(page);
  await expect(host.locator(".submission-card-hidden")).toHaveCount(0);
  await expect(host.getByTestId("board-status")).toContainText(
    "Vote for your favourite card"
  );
  await expect(host.getByTestId("leaderboard")).toHaveCount(0);
  await expect(host.getByTestId("submission-choice").first()).toBeEnabled();
  await expect(host.getByTestId("start-next-round")).toHaveCount(0);
  await expectRaisedCardCount(host, 0);
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await expectHandCardGone(carol, carolFirstHandCardText);
  await expectSubmissionChoicesNotToContain(host, "Host");
  await expectSubmissionChoicesNotToContain(host, "Alice");
  await expectSubmissionChoicesNotToContain(host, "★ 1");
  await takeScreenshot("10-singleplayer-round-one-pick-winner.png");

  await pickSubmissionForPlayer(page, "host", "Alice");
  await expect(
    host.getByTestId("submission-choice").filter({ hasText: "★ 1" })
  ).toHaveCount(1);
  await expectSubmissionChoicesNotToContain(host, "Host");
  await expectSubmissionChoicesNotToContain(host, "Alice");
  await takeScreenshot("11-singleplayer-round-one-vote-cast.png");
  await pickSubmissionForPlayer(page, "alice", "Host");
  await pickSubmissionForPlayer(page, "bob", "Alice");
  await pickSubmissionForPlayer(page, "carol", "Alice");
  await expect(host.getByTestId("board-status")).toContainText(
    "Votes locked in"
  );
  await expireSingleplayerSubmissionTimer(page);
  await expect(host.getByTestId("board-status")).toContainText(
    "Alice wins this round"
  );
  await expect(host.getByTestId("start-next-round")).toBeVisible();
  await expect(alice.getByTestId("start-next-round")).toHaveCount(0);
  await expect(bob.getByTestId("start-next-round")).toHaveCount(0);
  await expect(carol.getByTestId("start-next-round")).toHaveCount(0);
  await expect(
    host.getByTestId("submission-choice").filter({ hasText: "Alice" })
  ).toHaveCount(1);
  await expect(
    host.getByTestId("submission-choice").filter({ hasText: "Alice" })
  ).toContainText("★ 3");
  await expect(
    host.getByTestId("submission-choice").filter({ hasText: "Host" })
  ).toContainText("★ 1");
  await expect(host.getByTestId("leaderboard")).toBeVisible();
  await expect(host.getByTestId("leaderboard")).toContainText("Alice");
  await expect(host.getByTestId("leaderboard")).toContainText("1");
  await expect(alice.getByTestId("board-status")).toContainText(
    "You win this round"
  );
  await expect(bob.getByTestId("board-status")).toContainText(
    "Alice wins this round"
  );
  await expect(carol.getByTestId("board-status")).toContainText(
    "Alice wins this round"
  );
  if (hostFirstHandCardText) {
    await expect(host.getByTestId("hand-grid")).not.toContainText(
      hostFirstHandCardText
    );
  }
  await expectHandCardGone(alice, aliceFirstHandCardText);
  await expectHandCardGone(bob, bobFirstHandCardText);
  await expectHandCardGone(carol, carolFirstHandCardText);
  await takeScreenshot("12-singleplayer-round-one-winner-picked.png");

  // Round 2: all players can submit and vote; host becomes a normal participant too.
  await host.getByTestId("start-next-round").click();
  await refreshSingleplayerSubmissionTimer(page);
  await expect(alice.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(host.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(bob.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(carol.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(alice.getByTestId("black-card")).toContainText("Round 2");
  await expectRaisedCardCount(host, 0);
  await expectRaisedCardCount(alice, 0);
  await expectRaisedCardCount(bob, 0);
  await expectRaisedCardCount(carol, 0);
  await takeScreenshot("13-singleplayer-round-two-start.png");

  // Round 2 submissions: host submits, Bob submits, and Carol abstains.
  await raiseFirstCards(host, 1);
  await refreshSingleplayerSubmissionTimer(page);
  await expect(alice.getByTestId("submission-choice")).toHaveCount(1);
  await expect(bob.getByTestId("hand-status")).toContainText("Raise 1 card");
  await expect(carol.getByTestId("hand-status")).toContainText("Raise 1 card");
  await takeScreenshot("14-singleplayer-round-two-host-raised.png");

  await bob.getByTestId("hand-card").first().click();
  await refreshSingleplayerSubmissionTimer(page);
  await expect(alice.getByTestId("submission-choice")).toHaveCount(2);
  await expect(alice.getByTestId("submission-choice")).toHaveCount(2);
  await expectRaisedCardCount(carol, 0);

  // Round 2 countdown end: with one abstaining player, the round completes with automatic reveals.
  await expireSingleplayerSubmissionTimer(page);
  await expect(alice.getByTestId("board-status")).toContainText(
    "Revealing cards"
  );
  await expect(alice.getByTestId("submission-choice")).toHaveCount(2);
  await expireSingleplayerSubmissionTimer(page);
  await expireSingleplayerSubmissionTimer(page);
  await expect(alice.getByTestId("board-status")).toContainText(
    "Vote for your favourite card"
  );
  await expect(alice.getByTestId("submission-choice").first()).toBeEnabled();
  await expectSubmissionChoicesNotToContain(alice, "Host");
  await expectSubmissionChoicesNotToContain(alice, "Bob");
  await expectSubmissionChoicesNotToContain(alice, "★ 1");
  await takeScreenshot("15-singleplayer-round-two-bob-raised.png");

  await expect(alice.getByTestId("submission-choice")).toHaveCount(2);
  await expectRaisedCardCount(alice, 0);
  await expectRaisedCardCount(host, 0);
  await expectRaisedCardCount(bob, 0);
  await expectRaisedCardCount(carol, 0);
  await takeScreenshot("16-singleplayer-round-two-all-revealed.png");

  await pickSubmissionForPlayer(page, "alice", "Host");
  await expect(
    alice.getByTestId("submission-choice").filter({ hasText: "★ 1" })
  ).toHaveCount(1);
  await expectSubmissionChoicesNotToContain(alice, "Host");
  await expectSubmissionChoicesNotToContain(alice, "Bob");
  await pickSubmissionForPlayer(page, "host", "Bob");
  await pickSubmissionForPlayer(page, "bob", "Host");
  await pickSubmissionForPlayer(page, "carol", "Host");
  await expect(host.getByTestId("board-status")).toContainText(
    "Votes locked in"
  );
  await expireSingleplayerSubmissionTimer(page);
  await expect(alice.getByTestId("board-status")).toContainText(
    "Host wins this round"
  );
  await expect(host.getByTestId("start-next-round")).toBeVisible();
  await expect(alice.getByTestId("start-next-round")).toHaveCount(0);
  await expect(bob.getByTestId("start-next-round")).toHaveCount(0);
  await expect(carol.getByTestId("start-next-round")).toHaveCount(0);
  await expect(
    alice.getByTestId("submission-choice").filter({ hasText: "Host" })
  ).toHaveCount(1);
  await expect(host.getByTestId("board-status")).toContainText(
    "You win this round"
  );
  await expect(bob.getByTestId("board-status")).toContainText(
    "Host wins this round"
  );
  await expect(carol.getByTestId("board-status")).toContainText(
    "Host wins this round"
  );
  await expect(
    alice.getByTestId("submission-choice").filter({ hasText: "Host" })
  ).toContainText("★ 3");
  await expect(
    alice.getByTestId("submission-choice").filter({ hasText: "Bob" })
  ).toContainText("★ 1");
  await expectRaisedCardCount(alice, 0);
  await expectRaisedCardCount(host, 0);
  await expectRaisedCardCount(bob, 0);
  await expectRaisedCardCount(carol, 0);
  await takeScreenshot("17-singleplayer-round-two-pick-winner.png");
});
