import { expect, test } from "@playwright/test";

import { waitForAnimationsToFinish } from "./singleplayer.page.js";

function withAppPath(baseURL: string, pathname: string): URL {
  const url = new URL(baseURL);
  const basePath = url.pathname.replace(/\/+$/, "");
  url.pathname = `${basePath}${pathname}`.replace(/\/{2,}/g, "/");
  return url;
}

test.use({
  viewport: {
    width: 1800,
    height: 1200
  }
});

test("board slots lab shows 1 through 12 cards around the black card", async ({
  page,
  baseURL
}) => {
  for (let count = 1; count <= 12; count += 1) {
    const url = withAppPath(baseURL!, "/dev/board-slots");
    url.searchParams.set("count", String(count));

    await page.goto(url.toString());
    await expect(page.getByTestId("black-card")).toBeVisible();
    await expect(page.getByTestId("submission-choice")).toHaveCount(count);
    await expect(page.getByTestId("hand-card")).toHaveCount(7);
    await waitForAnimationsToFinish(page);
    await expect(page).toHaveScreenshot(`board-slots-${count}.png`);
  }
});

test.describe("small laptop viewport", () => {
  test.use({
    viewport: {
      width: 1366,
      height: 768
    }
  });

  test("board slots lab fits 12 cards and a hand", async ({
    page,
    baseURL
  }) => {
    const url = withAppPath(baseURL!, "/dev/board-slots");
    url.searchParams.set("count", "12");

    await page.goto(url.toString());
    await expect(page.getByTestId("black-card")).toBeVisible();
    await expect(page.getByTestId("submission-choice")).toHaveCount(12);
    await expect(page.getByTestId("hand-card")).toHaveCount(7);
    await waitForAnimationsToFinish(page);

    const overflow = await page
      .locator(
        '[data-testid="black-card"], [data-testid="submission-choice"], [data-testid="hand-card"]'
      )
      .evaluateAll((elements) => {
        const allowedOverflow = 1;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        return elements.flatMap((element, index) => {
          const rect = element.getBoundingClientRect();
          const fits =
            rect.left >= -allowedOverflow &&
            rect.top >= -allowedOverflow &&
            rect.right <= viewportWidth + allowedOverflow &&
            rect.bottom <= viewportHeight + allowedOverflow;

          if (fits) {
            return [];
          }

          return [
            `${element.getAttribute("data-testid") ?? "element"} ${index} overflows ${Math.round(rect.left)},${Math.round(rect.top)},${Math.round(rect.right)},${Math.round(rect.bottom)}`
          ];
        });
      });

    expect(overflow).toEqual([]);

    const statusOverlap = await page.evaluate(() => {
      const status = document.querySelector<HTMLElement>(
        '[data-testid="board-status"]'
      );

      if (!status) {
        return [];
      }

      const statusRect = status.getBoundingClientRect();
      const cards = [
        ...document.querySelectorAll<HTMLElement>(
          '[data-testid="black-card"], [data-testid="submission-choice"], [data-testid="hand-card"]'
        )
      ];

      return cards.flatMap((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const overlaps =
          statusRect.left < cardRect.right &&
          statusRect.right > cardRect.left &&
          statusRect.top < cardRect.bottom &&
          statusRect.bottom > cardRect.top;

        if (!overlaps) {
          return [];
        }

        return [
          `board status overlaps ${card.getAttribute("data-testid") ?? "card"} ${index}`
        ];
      });
    });

    expect(statusOverlap).toEqual([]);
    await expect(page).toHaveScreenshot("board-slots-12-laptop.png");
  });
});

test("landing status lab shows the guest connection timeout guidance", async ({
  page,
  baseURL
}) => {
  const url = withAppPath(baseURL!, "/dev/landing-status");

  await page.goto(url.toString());
  await expect(page.getByText(/Could not reach the host\./)).toBeVisible();
  await expect(page).toHaveScreenshot("landing-guest-timeout.png");
});

test("landing status lab shows the replaced-session state", async ({
  page,
  baseURL
}) => {
  const url = withAppPath(baseURL!, "/dev/landing-status");
  url.searchParams.set("status", "This game is now active in another tab.");

  await page.goto(url.toString());
  await expect(
    page.getByText("This game is now active in another tab.")
  ).toBeVisible();
  await expect(page).toHaveScreenshot("landing-session-replaced.png");
});

test("invalid routes show a 404 with a link back to the landing page", async ({
  page,
  baseURL
}) => {
  const url = withAppPath(baseURL!, "/totally-invalid-route");

  await page.goto(url.toString());
  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByText("Page not found")).toBeVisible();
  await expect(page.getByTestId("not-found-home-link")).toHaveAttribute(
    "href",
    "/game"
  );
  await expect(
    page.getByRole("link", { name: "Meet the code on GitHub" })
  ).toHaveAttribute("href", "https://github.com/cards-against-developers/game");
  await expect(page).toHaveScreenshot("not-found-page.png");
});

test("card animations lab covers raised, pickable, and winner-picked states", async ({
  page,
  baseURL
}) => {
  const url = withAppPath(baseURL!, "/dev/card-animations");

  url.searchParams.set("stage", "hand-picked");
  await page.goto(url.toString());
  await expect(page.getByTestId("hand-card").first()).toHaveClass(/raised/);
  await waitForAnimationsToFinish(page);
  await expect(page).toHaveScreenshot("card-animations-hand-picked.png");

  url.searchParams.set("stage", "reveal");
  await page.goto(url.toString());
  await expect(page.locator(".submission-card-hidden")).toHaveCount(3);
  await waitForAnimationsToFinish(page);
  await expect(page).toHaveScreenshot("card-animations-reveal.png");

  url.searchParams.set("stage", "pick-winner");
  await page.goto(url.toString());
  await expect(page.getByTestId("board-status")).toContainText(
    "Vote for your favourite card"
  );
  await expect(page.getByTestId("leaderboard")).toHaveCount(0);
  await expect(page.getByTestId("submission-choice").first()).toBeEnabled();
  await waitForAnimationsToFinish(page);
  await expect(page).toHaveScreenshot("card-animations-pick-winner.png");

  url.searchParams.set("stage", "winner-picked");
  await page.goto(url.toString());
  await expect(page.getByTestId("board-status")).toContainText(
    "Bob wins this round"
  );
  await expect(page.getByTestId("submission-choice").nth(1)).toContainText(
    "Bob"
  );
  await expect(page.getByTestId("leaderboard")).toBeVisible();
  await expect(page.getByTestId("leaderboard")).toContainText("Bob");
  await expect(page.getByTestId("leaderboard")).toContainText("1");
  await waitForAnimationsToFinish(page);
  await expect(page).toHaveScreenshot("card-animations-winner-picked.png");

  url.searchParams.set("stage", "round-reset");
  await page.goto(url.toString());
  await expect(page.getByTestId("black-card")).toContainText("Round 4");
  await expect(page.getByTestId("board-status")).toContainText(
    "Pick your card"
  );
  await expect(page.getByTestId("submission-choice")).toHaveCount(0);
  await waitForAnimationsToFinish(page);
  await expect(page).toHaveScreenshot("card-animations-round-reset.png");
});

test("card animations lab follows browser back and forward", async ({
  page,
  baseURL
}) => {
  const url = withAppPath(baseURL!, "/dev/card-animations");
  url.searchParams.set("stage", "hand-picked");

  await page.goto(url.toString());
  await page.getByTestId("card-animations-stage-reveal").click();
  await expect(page.locator(".game-stage")).toHaveClass(
    /card-animations-stage-reveal/
  );

  await page.getByTestId("card-animations-stage-pick-winner").click();
  await expect(page.locator(".game-stage")).toHaveClass(
    /card-animations-stage-pick-winner/
  );

  await page.goBack();
  await expect(page.locator(".game-stage")).toHaveClass(
    /card-animations-stage-reveal/
  );

  await page.goForward();
  await expect(page.locator(".game-stage")).toHaveClass(
    /card-animations-stage-pick-winner/
  );
});
