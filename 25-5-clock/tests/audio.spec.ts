import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test(`When a countdown reaches zero (NOTE: timer MUST reach 00:00),
    a sound indicating that time is up should play.
    This should utilize an HTML5 <audio> tag and have a corresponding id="beep".`, async ({
  page,
}) => {
  await page.clock.install();

  const startButton = page.locator("#start_stop");
  const sessionDecrement = page.locator("#session-decrement");
  const timeLeft = page.locator("#time-left");

  await expect(sessionDecrement).toBeVisible();
  await expect(startButton).toBeVisible();

  for (let i = 0; i < 25; i++) {
    await sessionDecrement.click();
  }

  await startButton.click();

  await expect(timeLeft).toHaveText("01:00");

  await page.clock.runFor(60000);

  await page.waitForTimeout(1000);

  const isPlaying = await page.evaluate(() => {
    const audioElement = document.querySelector(`#beep`) as HTMLAudioElement;
    return audioElement && !audioElement.paused;
  });

  expect(isPlaying).toBe(true);
});

test(`The audio element with id="beep" must be 1 second or longer.`, async ({
  page,
}) => {
  await page.clock.install();

  const startButton = page.locator("#start_stop");
  const sessionDecrement = page.locator("#session-decrement");
  const timeLeft = page.locator("#time-left");

  await expect(sessionDecrement).toBeVisible();
  await expect(startButton).toBeVisible();

  for (let i = 0; i < 25; i++) {
    await sessionDecrement.click();
  }

  await startButton.click();

  await expect(timeLeft).toHaveText("01:00");

  await page.clock.runFor(60000);

  await page.waitForTimeout(1000);

  const isAudioPlaying = async () => {
    return await page.evaluate(() => {
      const audioElement = document.querySelector(`#beep`) as HTMLAudioElement;
      return audioElement && !audioElement.paused;
    });
  };

  expect(await isAudioPlaying()).toBe(true);

  await page.waitForTimeout(1000);
  expect(await isAudioPlaying()).toBe(true);
});

test(`The audio element with id of "beep" must stop playing and be rewound to the beginning
    when the element with the id of "reset" is clicked.`, async ({ page }) => {
  await page.clock.install();

  const startButton = page.locator("#start_stop");
  const resetButton = page.locator("#reset");
  const sessionDecrement = page.locator("#session-decrement");
  const timeLeft = page.locator("#time-left");

  await expect(sessionDecrement).toBeVisible();
  await expect(startButton).toBeVisible();

  for (let i = 0; i < 25; i++) {
    await sessionDecrement.click();
  }

  await startButton.click();

  await expect(timeLeft).toHaveText("01:00");

  await page.clock.runFor(60000);

  await page.waitForTimeout(1000);

  const isAudioPlaying = async () => {
    return await page.evaluate(() => {
      const audioElement = document.querySelector(`#beep`) as HTMLAudioElement;
      return audioElement && !audioElement.paused;
    });
  };

  expect(await isAudioPlaying()).toBe(true);

  await resetButton.click();

  expect(await isAudioPlaying()).toBe(false);
});
