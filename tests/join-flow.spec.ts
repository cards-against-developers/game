import { expect, test, type Page } from "@playwright/test";
import {
  waitForAnimationsToFinish,
  waitForBoardTransitionsToFinish
} from "./singleplayer.page.js";

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
  return url.toString();
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
    await expect(page.getByText(username).first()).toBeVisible({
      timeout: 20_000
    });
  }
}

test("host and guests can refresh and recover before and after the game starts", async ({
  browser,
  baseURL
}) => {
  const hostSeed = "join-flow-seed";
  const context = await browser.newContext({
    viewport: {
      width: 1800,
      height: 1400
    }
  });
  await context.addInitScript(() => {
    const fixedNow = 1_760_000_000_000;
    Date.now = () => fixedNow;
  });

  const hostPage = await context.newPage();
  const alicePage = await context.newPage();
  const bobPage = await context.newPage();

  await hostPage.goto(
    buildAppUrl(baseURL!, "host", {
      seed: hostSeed
    })
  );
  await hostPage.getByLabel("Username").fill("Host");
  await hostPage.getByTestId("create-host").click();
  await expect(hostPage.getByTestId("board-panel")).toBeVisible();
  await expect(hostPage).toHaveScreenshot("01-join-flow-host.png");

  const joinUrl = hostPage.url();

  await joinFromSharedUrl(
    alicePage,
    buildGameUrl(
      baseURL!,
      "alice",
      Object.fromEntries(new URL(joinUrl).searchParams)
    ),
    "Alice"
  );
  await waitForLobbySeats(alicePage, ["Host", "Alice"]);
  await expect(alicePage).toHaveScreenshot("02-join-flow-alice.png");

  await joinFromSharedUrl(
    bobPage,
    buildGameUrl(
      baseURL!,
      "bob",
      Object.fromEntries(new URL(joinUrl).searchParams)
    ),
    "Bob"
  );
  await waitForLobbySeats(bobPage, ["Host", "Alice", "Bob"]);
  await expect(bobPage).toHaveScreenshot("03-join-flow-bob.png");

  await waitForLobbySeats(hostPage, ["Host", "Alice", "Bob"]);
  await expect(hostPage.getByTestId("start-game")).toBeEnabled();
  await expect(hostPage).toHaveScreenshot("04-join-flow-host-ready.png");
  await hostPage.getByTestId("start-game").click();
  await expect(hostPage.getByTestId("black-card")).toContainText("Round 1");

  await hostPage.reload();
  await expect(hostPage.getByTestId("board-panel")).toBeVisible();
  await expect(hostPage.getByTestId("black-card")).toContainText("Round 1");
  await waitForAnimationsToFinish(hostPage);
  await waitForBoardTransitionsToFinish(hostPage);
  await expect(hostPage.getByTestId("board-panel")).toHaveScreenshot(
    "05-join-flow-host-refreshed.png"
  );

  await bobPage.reload();
  await expect(bobPage.getByTestId("board-panel")).toBeVisible();
  await expect(bobPage.getByTestId("black-card")).toContainText("Round 1");
  await waitForAnimationsToFinish(bobPage);
  await waitForBoardTransitionsToFinish(bobPage);
  await expect(bobPage.getByTestId("board-panel")).toHaveScreenshot(
    "06-join-flow-bob-refreshed.png"
  );

  await context.close();
});

test("browser back leaves the active game and returns to the landing page", async ({
  page,
  baseURL
}) => {
  await page.goto(
    buildAppUrl(baseURL!, "host", {
      seed: "join-flow-back-seed"
    })
  );
  await page.getByLabel("Username").fill("Host");
  await page.getByTestId("create-host").click();

  await expect(page.getByTestId("board-panel")).toBeVisible();
  await expect(page).toHaveURL(/\/play\?/);

  await page.goBack();

  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByTestId("create-host")).toBeVisible();
  await expect(page).not.toHaveURL(/\/play\?/);
});

test("landing auto-recovers a returning guest and redirects into the game", async ({
  browser,
  baseURL
}) => {
  const hostSeed = "join-flow-recovery-seed";
  const context = await browser.newContext({
    viewport: {
      width: 1800,
      height: 1400
    }
  });

  const hostPage = await context.newPage();
  const alicePage = await context.newPage();

  await hostPage.goto(
    buildAppUrl(baseURL!, "host", {
      seed: hostSeed
    })
  );
  await hostPage.getByLabel("Username").fill("Host");
  await hostPage.getByTestId("create-host").click();
  await expect(hostPage.getByTestId("board-panel")).toBeVisible();

  const joinParams = Object.fromEntries(new URL(hostPage.url()).searchParams);

  await joinFromSharedUrl(
    alicePage,
    buildGameUrl(baseURL!, "alice", joinParams),
    "Alice"
  );
  await waitForLobbySeats(alicePage, ["Host", "Alice"]);

  await alicePage.close();

  const recoveredAlicePage = await context.newPage();
  await recoveredAlicePage.goto(buildGameUrl(baseURL!, "alice", joinParams));

  await expect(recoveredAlicePage).toHaveURL(/\/play\?/);
  await expect(recoveredAlicePage.getByTestId("board-panel")).toBeVisible({
    timeout: 20_000
  });
  await waitForLobbySeats(recoveredAlicePage, ["Host", "Alice"]);

  await context.close();
});

test("room links on the landing route are ignored", async ({
  page,
  baseURL
}) => {
  await page.goto(
    buildAppUrl(baseURL!, "guest", {
      host: "host-123",
      room: "room-456"
    })
  );

  await expect(page).toHaveURL(/\/game\?host=host-123&room=room-456/);
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByTestId("create-host")).toBeVisible();
  await expect(page.getByTestId("join-host")).toHaveCount(0);
});
