import { expect, test, type BrowserContext, type Page } from "@playwright/test";

function withAppPath(baseURL: string, pathname: string): URL {
  const url = new URL(baseURL);
  const basePath = url.pathname.replace(/\/+$/, "");
  url.pathname = `${basePath}${pathname}`.replace(/\/{2,}/g, "/");
  return url;
}

function buildAppUrl(
  baseURL: string,
  profile: string,
  params: Record<string, string> = {}
): string {
  const url = new URL(baseURL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  url.searchParams.set("transport", "loopback");
  url.searchParams.set("profile", profile);
  url.searchParams.set("debug", "1");

  return url.toString();
}

function buildGameUrl(
  baseURL: string,
  profile: string,
  params: Record<string, string> = {}
): string {
  const url = withAppPath(baseURL, "/play");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("transport", "loopback");
  url.searchParams.set("profile", profile);
  url.searchParams.set("debug", "1");
  return url.toString();
}

function buildFastReconnectParams(
  params: Record<string, string> = {}
): Record<string, string> {
  return {
    guestConnectTimeoutMs: "250",
    guestReconnectAttempts: "2",
    guestReconnectBackoffMs: "100,150",
    ...params
  };
}

type DebugSyncPlayer = {
  id: string;
  username: string;
  connected: boolean;
  disconnectSecondsLeft: number | null;
};

type DebugSyncState = {
  phase: string;
  round: number;
  judgeId: string | null;
  lastWinnerId: string | null;
  winnerSelectionClosed?: boolean;
  submissions: Array<{
    id: string;
    playerName?: string;
    hidden?: boolean;
  }>;
  players: DebugSyncPlayer[];
};

type DebugGuestState = {
  selfPlayerId: string;
  handIds: string[];
  handTexts: string[];
  status: string;
  reconnectBlocked: boolean;
  hasChannel: boolean;
};

type GamePages = {
  context: BrowserContext;
  hostPage: Page;
  alicePage: Page;
  bobPage: Page;
  joinParams: Record<string, string>;
};

function stripCountdown(text: string): string {
  return text.replace(/\s+·\s+\d+:\d{2}(?: left)?$/, "");
}

async function joinFromSharedUrl(
  page: Page,
  joinUrl: string,
  username: string
): Promise<void> {
  await page.goto(joinUrl);
  await page.getByLabel("Username").fill(username);
  await page.getByTestId("join-host").click();
  await expect(page.getByTestId("board-panel")).toBeVisible();
}

async function waitForLobbySeats(
  page: Page,
  usernames: string[]
): Promise<void> {
  for (const username of usernames) {
    await expect(page.getByTestId("board-panel")).toContainText(username, {
      timeout: 20_000
    });
  }
}

// Debug helper: read the recovering guest's identity and rendered hand.
async function readGuestState(page: Page): Promise<DebugGuestState> {
  return page.evaluate(() => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        currentSync: () => {
          selfPlayerId: string;
          hand: string[];
        };
        state: {
          guest: {
            status: string;
            reconnectBlocked?: boolean;
            channel: unknown | null;
          };
        };
      };
    };
    const controller = debugWindow.__cardsAgainstDevelopersController;
    if (!controller) {
      throw new Error("Missing debug controller.");
    }

    const handTexts = Array.from(
      document.querySelectorAll<HTMLElement>('[data-testid="hand-card-copy"]')
    ).map((node) => node.innerText.trim());

    return {
      selfPlayerId: controller.currentSync().selfPlayerId,
      handIds: [...controller.currentSync().hand],
      handTexts,
      status: controller.state.guest.status,
      reconnectBlocked: Boolean(controller.state.guest.reconnectBlocked),
      hasChannel: Boolean(controller.state.guest.channel)
    };
  });
}

// Debug helper: inspect the current synced state from the page.
async function readSyncState(page: Page): Promise<DebugSyncState> {
  return page.evaluate(() => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        currentSync: () => DebugSyncState;
      };
    };
    const controller = debugWindow.__cardsAgainstDevelopersController;
    if (!controller) {
      throw new Error("Missing debug controller.");
    }

    return controller.currentSync();
  });
}

async function readSyncPlayers(page: Page): Promise<DebugSyncPlayer[]> {
  return (await readSyncState(page)).players;
}

// Simulate an unexpected transport drop without clearing stored identity.
async function closeGuestChannel(page: Page): Promise<void> {
  await page.evaluate(() => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        state: {
          guest: {
            channel: { close: () => void } | null;
          };
        };
      };
    };
    debugWindow.__cardsAgainstDevelopersController?.state.guest.channel?.close();
  });
}

async function disableGuestReconnect(page: Page): Promise<void> {
  await page.evaluate(() => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        state: {
          guest: {
            reconnectBlocked?: boolean;
          };
        };
      };
    };
    if (debugWindow.__cardsAgainstDevelopersController) {
      debugWindow.__cardsAgainstDevelopersController.state.guest.reconnectBlocked = true;
    }
  });
}

async function enableGuestReconnect(page: Page): Promise<void> {
  await page.evaluate(() => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        state: {
          guest: {
            reconnectBlocked?: boolean;
          };
        };
      };
    };
    if (debugWindow.__cardsAgainstDevelopersController) {
      debugWindow.__cardsAgainstDevelopersController.state.guest.reconnectBlocked = false;
    }
  });
}

async function waitForAutoReconnect(page: Page): Promise<void> {
  await expect
    .poll(async () => (await readGuestState(page)).selfPlayerId, {
      timeout: 15_000
    })
    .not.toBe("");
}

async function readBoardStatus(page: Page): Promise<string> {
  return page.getByTestId("board-status").innerText();
}

async function readHostPlayerConnectionId(
  page: Page,
  username: string
): Promise<string | null> {
  return page.evaluate((targetUsername) => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        state: {
          host: {
            state: {
              players: Array<{
                username: string;
                connectionId: string | null;
              }>;
            };
          } | null;
        };
      };
    };
    const players =
      debugWindow.__cardsAgainstDevelopersController?.state.host?.state.players;
    if (!players) {
      throw new Error("Missing host runtime.");
    }

    return (
      players.find((player) => player.username === targetUsername)
        ?.connectionId ?? null
    );
  }, username);
}

async function expireHostSubmissionTimer(page: Page): Promise<void> {
  await page.evaluate(() => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        state: {
          host: {
            state: {
              submissionDeadlineAt: number | null;
            };
          } | null;
        };
      };
    };
    const host = debugWindow.__cardsAgainstDevelopersController?.state.host;
    if (!host) {
      throw new Error("Missing host runtime.");
    }

    host.state.submissionDeadlineAt = Date.now() - 1;
  });
}

async function pickHostSubmissionByPlayerName(
  page: Page,
  playerName: string
): Promise<void> {
  await page.evaluate(async (targetPlayerName) => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        currentSync: () => DebugSyncState;
        state: {
          host: {
            state: {
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
        pickSubmission: (submissionId: string) => Promise<void>;
      };
    };
    const controller = debugWindow.__cardsAgainstDevelopersController;
    if (!controller) {
      throw new Error("Missing debug controller.");
    }

    const hostState = controller.state.host?.state;
    const playerId =
      hostState?.players.find((entry) => entry.username === targetPlayerName)
        ?.id ?? null;
    const submission =
      (playerId
        ? hostState?.submissions.find((entry) => entry.playerId === playerId)
        : null) ??
      controller
        .currentSync()
        .submissions.find((entry) => entry.playerName === targetPlayerName);
    if (!submission) {
      throw new Error(`Missing submission for ${targetPlayerName}.`);
    }

    await controller.pickSubmission(submission.id);
  }, playerName);
}

async function readHostSubmissionIdByPlayerName(
  page: Page,
  playerName: string
): Promise<string | null> {
  return page.evaluate((targetPlayerName) => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        state: {
          host: {
            state: {
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
    const hostState =
      debugWindow.__cardsAgainstDevelopersController?.state.host?.state;
    if (!hostState) {
      throw new Error("Missing host state.");
    }

    const playerId =
      hostState.players.find((entry) => entry.username === targetPlayerName)
        ?.id ?? null;
    const submission = playerId
      ? hostState.submissions.find((entry) => entry.playerId === playerId)
      : null;
    return submission?.id ?? null;
  }, playerName);
}

async function pickSubmissionById(
  page: Page,
  submissionId: string
): Promise<void> {
  await page.evaluate(async (targetSubmissionId) => {
    const debugWindow = window as Window & {
      __cardsAgainstDevelopersController?: {
        pickSubmission: (submissionId: string) => Promise<void>;
      };
    };
    const controller = debugWindow.__cardsAgainstDevelopersController;
    if (!controller) {
      throw new Error("Missing debug controller.");
    }

    await controller.pickSubmission(targetSubmissionId);
  }, submissionId);
}

async function createStartedThreePlayerGame(
  browser: Parameters<typeof test>[0]["browser"],
  baseURL: string
): Promise<GamePages> {
  const context = await browser.newContext({
    viewport: {
      width: 1800,
      height: 1400
    }
  });

  const hostPage = await context.newPage();
  const alicePage = await context.newPage();
  const bobPage = await context.newPage();

  await hostPage.goto(buildAppUrl(baseURL, "host"));
  await hostPage.getByLabel("Username").fill("Host");
  await hostPage.getByTestId("create-host").click();
  await expect(hostPage.getByTestId("board-panel")).toBeVisible();

  const joinParams = Object.fromEntries(new URL(hostPage.url()).searchParams);
  await joinFromSharedUrl(
    alicePage,
    buildGameUrl(baseURL, "alice", joinParams),
    "Alice"
  );
  await waitForLobbySeats(alicePage, ["Host", "Alice"]);
  await joinFromSharedUrl(
    bobPage,
    buildGameUrl(baseURL, "bob", joinParams),
    "Bob"
  );
  await waitForLobbySeats(bobPage, ["Host", "Alice", "Bob"]);

  await waitForLobbySeats(hostPage, ["Host", "Alice", "Bob"]);
  await expect(hostPage.getByTestId("start-game")).toBeEnabled();
  await hostPage.getByTestId("start-game").click();
  await expect(hostPage.getByTestId("black-card")).toContainText("Round 1");

  return {
    context,
    hostPage,
    alicePage,
    bobPage,
    joinParams
  };
}

async function assertAliceMatchesBobView(
  alicePage: Page,
  bobPage: Page
): Promise<void> {
  expect(
    stripCountdown(await alicePage.getByTestId("board-status").innerText())
  ).toBe(stripCountdown(await bobPage.getByTestId("board-status").innerText()));
  expect(
    stripCountdown(await alicePage.getByTestId("hand-status").innerText())
  ).toBe(stripCountdown(await bobPage.getByTestId("hand-status").innerText()));
  expect(await alicePage.getByTestId("black-card").innerText()).toBe(
    await bobPage.getByTestId("black-card").innerText()
  );
}

async function advanceAliceToRoundTwo(
  hostPage: Page,
  alicePage: Page,
  bobPage: Page
): Promise<{ alicePlayerId: string }> {
  const alicePlayerId =
    (await readSyncPlayers(hostPage)).find(
      (player) => player.username === "Alice"
    )?.id ?? null;
  if (!alicePlayerId) {
    throw new Error("Missing Alice player id.");
  }

  await alicePage.getByTestId("hand-card").first().click();
  await expect
    .poll(() => readHostSubmissionIdByPlayerName(hostPage, "Alice"))
    .toBeTruthy();

  await bobPage.getByTestId("hand-card").first().click();
  await expect
    .poll(() => readHostSubmissionIdByPlayerName(hostPage, "Bob"))
    .toBeTruthy();

  await expireHostSubmissionTimer(hostPage);
  await expect(hostPage.getByTestId("board-status")).toContainText(
    "Vote for your favourite card"
  );
  const aliceSubmissionId = await readHostSubmissionIdByPlayerName(
    hostPage,
    "Alice"
  );
  const bobSubmissionId = await readHostSubmissionIdByPlayerName(
    hostPage,
    "Bob"
  );
  if (!aliceSubmissionId || !bobSubmissionId) {
    throw new Error("Expected Alice and Bob submissions.");
  }
  await pickHostSubmissionByPlayerName(hostPage, "Alice");
  await pickSubmissionById(alicePage, bobSubmissionId);
  await pickSubmissionById(bobPage, aliceSubmissionId);
  await expect
    .poll(() => readBoardStatus(hostPage))
    .toContain("Votes locked in");
  await expireHostSubmissionTimer(hostPage);
  await expect(hostPage.getByTestId("board-status")).toContainText(
    "Alice wins this round"
  );

  await hostPage.getByTestId("start-next-round").click();
  await expect(hostPage.getByTestId("black-card")).toContainText("Round 2");

  const roundTwoState = await readSyncState(hostPage);
  expect(roundTwoState.round).toBe(2);

  return { alicePlayerId };
}

test.describe("connectivity", () => {
  test.setTimeout(60_000);

  test("guest auto-reconnect preserves identity, hand, and current round view", async ({
    browser,
    baseURL
  }) => {
    const { context, hostPage, alicePage, bobPage } =
      await createStartedThreePlayerGame(browser, baseURL!);

    await expect(alicePage.getByTestId("hand-status")).toContainText(
      "Raise 1 card"
    );
    const initialAlice = await readGuestState(alicePage);
    expect(initialAlice.handTexts.length).toBe(7);

    await closeGuestChannel(alicePage);
    await waitForAutoReconnect(alicePage);

    const rejoinedAlice = await readGuestState(alicePage);
    expect(rejoinedAlice.selfPlayerId).toBe(initialAlice.selfPlayerId);
    expect(rejoinedAlice.handTexts).toEqual(initialAlice.handTexts);
    await assertAliceMatchesBobView(alicePage, bobPage);

    await expect
      .poll(async () => {
        const alice = (await readSyncPlayers(hostPage)).find(
          (player) => player.username === "Alice"
        );
        return alice?.connected;
      })
      .toBe(true);

    await context.close();
  });

  test("newer reconnect invalidates the older guest session", async ({
    browser,
    baseURL
  }) => {
    const { context, hostPage, alicePage, joinParams } =
      await createStartedThreePlayerGame(browser, baseURL!);
    const initialAlice = await readGuestState(alicePage);

    await closeGuestChannel(alicePage);
    await waitForAutoReconnect(alicePage);
    const rejoinedConnectionId = await readHostPlayerConnectionId(
      hostPage,
      "Alice"
    );

    const replacementPage = await context.newPage();
    await replacementPage.goto(buildGameUrl(baseURL!, "alice", joinParams));
    await expect(replacementPage.getByTestId("board-panel")).toBeVisible();
    await expect
      .poll(async () => (await readGuestState(replacementPage)).selfPlayerId)
      .toBe(initialAlice.selfPlayerId);
    await expect
      .poll(async () => {
        const aliceRuntime = await readGuestState(alicePage);
        return (
          aliceRuntime.status === "This game is now active in another tab." &&
          aliceRuntime.reconnectBlocked &&
          !aliceRuntime.hasChannel
        );
      })
      .toBe(true);
    await expect
      .poll(async () => {
        const nextConnectionId = await readHostPlayerConnectionId(
          hostPage,
          "Alice"
        );
        return (
          Boolean(nextConnectionId) && nextConnectionId !== rejoinedConnectionId
        );
      })
      .toBe(true);

    await context.close();
  });

  test("player removal after a non-returning disconnect preserves recovery identity", async ({
    browser,
    baseURL
  }) => {
    const { context, hostPage, alicePage, bobPage } =
      await createStartedThreePlayerGame(browser, baseURL!);

    await closeGuestChannel(alicePage);
    await waitForAutoReconnect(alicePage);
    const { alicePlayerId } = await advanceAliceToRoundTwo(
      hostPage,
      alicePage,
      bobPage
    );

    await disableGuestReconnect(alicePage);
    await closeGuestChannel(alicePage);
    await expect(alicePage.getByTestId("join-host")).toBeVisible();

    await expect
      .poll(
        async () =>
          (await readSyncPlayers(hostPage)).find(
            (player) => player.username === "Alice"
          ),
        { timeout: 15_000 }
      )
      .toMatchObject({
        username: "Alice",
        connected: false,
        disconnectSecondsLeft: null
      });

    await expect
      .poll(async () => {
        const sync = await readSyncState(hostPage);
        return {
          phase: sync.phase,
          lastWinnerId: sync.lastWinnerId,
          winnerSelectionClosed: sync.winnerSelectionClosed,
          submissions: sync.submissions.length
        };
      })
      .toEqual({
        phase: "submitting",
        lastWinnerId: null,
        winnerSelectionClosed: false,
        submissions: 0
      });

    await enableGuestReconnect(alicePage);
    await alicePage.waitForFunction(() => {
      return (
        Boolean(document.querySelector('[data-testid="board-panel"]')) ||
        Boolean(document.querySelector('[data-testid="join-host"]'))
      );
    });
    if (await alicePage.getByTestId("join-host").isVisible()) {
      await alicePage.getByTestId("join-host").click();
    }
    await expect(alicePage.getByTestId("board-panel")).toBeVisible();
    await expect
      .poll(async () => (await readGuestState(alicePage)).selfPlayerId)
      .toBe(alicePlayerId);
    await expect
      .poll(
        async () =>
          (await readSyncPlayers(hostPage)).find(
            (player) => player.username === "Alice"
          )?.connected,
        { timeout: 5_000 }
      )
      .toBe(true);

    await context.close();
  });

  test("guest survives repeated reconnect churn without changing identity", async ({
    browser,
    baseURL
  }) => {
    const { context, alicePage } = await createStartedThreePlayerGame(
      browser,
      baseURL!
    );

    const firstState = await readGuestState(alicePage);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await closeGuestChannel(alicePage);
      await waitForAutoReconnect(alicePage);
      const nextState = await readGuestState(alicePage);
      expect(nextState.selfPlayerId).toBe(firstState.selfPlayerId);
      expect(nextState.handTexts).toEqual(firstState.handTexts);
    }

    await context.close();
  });

  test("guests recover automatically when the host refreshes mid-round", async ({
    browser,
    baseURL
  }) => {
    const { context, hostPage, alicePage, bobPage } =
      await createStartedThreePlayerGame(browser, baseURL!);

    const aliceBefore = await readGuestState(alicePage);
    await hostPage.reload();
    await expect(hostPage.getByTestId("board-panel")).toBeVisible();
    await expect(hostPage.getByTestId("black-card")).toContainText("Round 1");

    await waitForAutoReconnect(alicePage);
    await waitForAutoReconnect(bobPage);

    const aliceAfter = await readGuestState(alicePage);
    expect(aliceAfter.selfPlayerId).toBe(aliceBefore.selfPlayerId);
    expect(aliceAfter.handTexts).toEqual(aliceBefore.handTexts);
    expect(await alicePage.getByTestId("black-card").innerText()).toBe(
      await bobPage.getByTestId("black-card").innerText()
    );

    await context.close();
  });

  test("guest retry exhaustion surfaces a final reconnect failure", async ({
    browser,
    baseURL
  }) => {
    const context = await browser.newContext();
    const hostPage = await context.newPage();
    const alicePage = await context.newPage();
    const bobPage = await context.newPage();

    await hostPage.goto(buildAppUrl(baseURL!, "host"));
    await hostPage.getByLabel("Username").fill("Host");
    await hostPage.getByTestId("create-host").click();

    const joinParams = buildFastReconnectParams(
      Object.fromEntries(new URL(hostPage.url()).searchParams)
    );
    await joinFromSharedUrl(
      alicePage,
      buildGameUrl(baseURL!, "alice", joinParams),
      "Alice"
    );
    await joinFromSharedUrl(
      bobPage,
      buildGameUrl(baseURL!, "bob", joinParams),
      "Bob"
    );

    await hostPage.getByTestId("start-game").click();
    await expect(alicePage.getByTestId("board-panel")).toBeVisible();

    await hostPage.close();
    await closeGuestChannel(alicePage);
    await expect
      .poll(async () => (await readGuestState(alicePage)).status, {
        timeout: 10_000
      })
      .toContain("Couldn't reconnect. Join again to get back in.");

    await context.close();
  });

  test("overlapping guest disconnects recover both players", async ({
    browser,
    baseURL
  }) => {
    const { context, hostPage, alicePage, bobPage } =
      await createStartedThreePlayerGame(browser, baseURL!);

    const aliceBefore = await readGuestState(alicePage);
    const bobBefore = await readGuestState(bobPage);

    await Promise.all([
      closeGuestChannel(alicePage),
      closeGuestChannel(bobPage)
    ]);
    await Promise.all([
      waitForAutoReconnect(alicePage),
      waitForAutoReconnect(bobPage)
    ]);

    const aliceAfter = await readGuestState(alicePage);
    const bobAfter = await readGuestState(bobPage);
    expect(aliceAfter.selfPlayerId).toBe(aliceBefore.selfPlayerId);
    expect(aliceAfter.handTexts).toEqual(aliceBefore.handTexts);
    expect(bobAfter.selfPlayerId).toBe(bobBefore.selfPlayerId);
    expect(bobAfter.handTexts).toEqual(bobBefore.handTexts);

    await expect
      .poll(async () =>
        (await readSyncPlayers(hostPage))
          .filter(
            (player) => player.username === "Alice" || player.username === "Bob"
          )
          .every((player) => player.connected)
      )
      .toBe(true);

    await context.close();
  });
});
