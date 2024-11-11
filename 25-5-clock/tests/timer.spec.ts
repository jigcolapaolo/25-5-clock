import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test(`When I click the element with the id of "reset",
    any running timer should be stopped, the value within id="break-length" should return to 5,
    the value within id="session-length" should return to 25, and the element with id="time-left"
    should reset to it's default`, async ({ page }) => {
  const resetButton = page.locator("#reset");
  await expect(resetButton).toBeVisible();
  await resetButton.click();

  await page.waitForTimeout(2000);

  await expect(page.locator("#time-left")).toHaveText("25:00");
  await expect(page.locator("#break-length")).toHaveText("5");
  await expect(page.locator("#session-length")).toHaveText("25");
});

test(`When I click the element with the id of "break-decrement",
    the value within id="break-length" decrements by a value of 1,
    and I can see the updated value.`, async ({ page }) => {
  const breakDecrement = page.locator("#break-decrement");
  await expect(breakDecrement).toBeVisible();
  await breakDecrement.click();

  await expect(page.locator("#break-length")).toHaveText("4");
});

test(`When I click the element with the id of "break-increment",
    the value within id="break-length" increments by a value of 1,
    and I can see the updated value.`, async ({ page }) => {
  const breakIncrement = page.locator("#break-increment");
  await expect(breakIncrement).toBeVisible();
  await breakIncrement.click();

  await expect(page.locator("#break-length")).toHaveText("6");
});

test(`When I click the element with the id of "session-decrement",
    the value within id="session-length" decrements by a value of 1,
    and I can see the updated value.`, async ({ page }) => {
  const sessionDecrement = page.locator("#session-decrement");
  await expect(sessionDecrement).toBeVisible();
  await sessionDecrement.click();

  await expect(page.locator("#session-length")).toHaveText("24");
});

test(`When I click the element with the id of "session-increment",
    the value within id="session-length" increments by a value of 1,
    and I can see the updated value.`, async ({ page }) => {
  const sessionIncrement = page.locator("#session-increment");
  await expect(sessionIncrement).toBeVisible();
  await sessionIncrement.click();

  await expect(page.locator("#session-length")).toHaveText("26");
});

test(`I should not be able to set a session or break length to <= 0.`, async ({
  page,
}) => {
  const sessionDecrement = page.locator("#session-decrement");
  const breakDecrement = page.locator("#break-decrement");

  await expect(sessionDecrement).toBeVisible();
  await expect(breakDecrement).toBeVisible();

  for (let i = 0; i < 30; i++) {
    await sessionDecrement.click();
    await breakDecrement.click();
  }

  await expect(page.locator("#session-length")).toHaveText("1");
  await expect(page.locator("#break-length")).toHaveText("1");
});

test(`I should not be able to set a session or break length to > 60.`, async ({
  page,
}) => {
  const sessionIncrement = page.locator("#session-increment");
  const breakIncrement = page.locator("#break-increment");

  await expect(sessionIncrement).toBeVisible();
  await expect(breakIncrement).toBeVisible();

  for (let i = 0; i < 70; i++) {
    await sessionIncrement.click();
    await breakIncrement.click();
  }

  await expect(page.locator("#session-length")).toHaveText("60");
  await expect(page.locator("#break-length")).toHaveText("60");
});

test(`When I first click the element with id="start_stop",
    the timer should begin running from the value currently displayed in id="session-length",
    even if the value has been incremented or decremented from the original value of 25.`, async ({
  page,
}) => {
  const startButton = page.locator("#start_stop");
  const sessionDecrement = page.locator("#session-decrement");

  await expect(sessionDecrement).toBeVisible();
  await expect(startButton).toBeVisible();

  await sessionDecrement.click();
  await startButton.click();

  await expect(page.locator("#time-left")).toHaveText("24:00");
});

test(`If the timer is running, the element with the id of "time-left"
    should display the remaining time in mm:ss format 
    (decrementing by a value of 1 and updating the display every 1000ms).`, async ({
  page,
}) => {
  const startButton = page.locator("#start_stop");
  await expect(startButton).toBeVisible();
  await startButton.click();

  await expect(page.locator("#time-left")).toHaveText("25:00");

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:59");

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:58");
});

test(`If the timer is running and I click the element with id="start_stop",
    the countdown should pause.`, async ({ page }) => {
  const startButton = page.locator("#start_stop");
  await expect(startButton).toBeVisible();
  await startButton.click();

  await expect(page.locator("#time-left")).toHaveText("25:00");

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:59");

  await startButton.click();

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:59");
});

test(`If the timer is paused and I click the element with id="start_stop",
    the countdown should resume running from the point at which it was paused.`, async ({
  page,
}) => {
  const startButton = page.locator("#start_stop");
  await expect(startButton).toBeVisible();
  await startButton.click();

  await expect(page.locator("#time-left")).toHaveText("25:00");

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:59");

  await startButton.click();

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:59");

  await startButton.click();

  await page.waitForTimeout(1000);

  await expect(page.locator("#time-left")).toHaveText("24:58");
});

test(`When a session countdown reaches zero (NOTE: timer MUST reach 00:00),
    and a new countdown begins, the element with the id of "timer-label"
    should display a string indicating a break has begun.`, async ({
  page,
}) => {
	  await page.clock.install();

    const startButton = page.locator("#start_stop");
    const sessionDecrement = page.locator("#session-decrement");
    const timerLabel = page.locator("#timer-label");
    const timeLeft = page.locator("#time-left");
  
    await expect(sessionDecrement).toBeVisible();
    await expect(startButton).toBeVisible();
  
    for (let i = 0; i < 25; i++) {
      await sessionDecrement.click();
    }
  
    await startButton.click();
  
    await expect(timeLeft).toHaveText("01:00");
    
    await page.clock.runFor(60000);
  
    await expect(timeLeft).toHaveText("00:00");
  
    await expect(timerLabel).toHaveText("Break");
    
    await expect(timeLeft).toHaveText("05:00");
});

test(`When a session countdown reaches zero (NOTE: timer MUST reach 00:00),
  a new break countdown should begin, counting down from the value currently displayed
  in the id="break-length" element.`, async ({
  page,
}) => {
  await page.clock.install();

  const startButton = page.locator("#start_stop");
  const sessionDecrement = page.locator("#session-decrement");
  const breakDecrement = page.locator("#break-decrement");
  const timerLabel = page.locator("#timer-label");
  const timeLeft = page.locator("#time-left");

  await expect(breakDecrement).toBeVisible();
  await expect(sessionDecrement).toBeVisible();
  await expect(startButton).toBeVisible();

  for (let i = 0; i < 25; i++) {
    await sessionDecrement.click();
  }

  for (let i = 0; i < 5; i++) {
    await breakDecrement.click();
  }

  await startButton.click();

  await expect(timeLeft).toHaveText("01:00");
  
  await page.clock.runFor(60000);

  await expect(timeLeft).toHaveText("00:00");

  await expect(timerLabel).toHaveText("Break");
  
  await expect(timeLeft).toHaveText("01:00");
})

test(`When a break countdown reaches zero (NOTE: timer MUST reach 00:00),
  and a new countdown begins, the element with the id of "timer-label" should
  display a string indicating a session has begun.`, async ({ page }) => {
    await page.clock.install();

    const startButton = page.locator("#start_stop");
    const sessionDecrement = page.locator("#session-decrement");
    const breakDecrement = page.locator("#break-decrement");
    const timerLabel = page.locator("#timer-label");
    const timeLeft = page.locator("#time-left");
  
    await expect(breakDecrement).toBeVisible();
    await expect(sessionDecrement).toBeVisible();
    await expect(startButton).toBeVisible();
  
    for (let i = 0; i < 25; i++) {
      await sessionDecrement.click();
    }
  
    for (let i = 0; i < 5; i++) {
      await breakDecrement.click();
    }
  
    await startButton.click();
  
    await expect(timeLeft).toHaveText("01:00");
    
    await page.clock.runFor(60000);
  
    await expect(timeLeft).toHaveText("00:00");
  
    await expect(timerLabel).toHaveText("Break");
    
    await expect(timeLeft).toHaveText("01:00");

    await page.clock.runFor(60000);
  
    await expect(timeLeft).toHaveText("00:00");
  
    await expect(timerLabel).toHaveText("Session");
});

test(`When a break countdown reaches zero (NOTE: timer MUST reach 00:00),
  a new session countdown should begin, counting down from the value currently displayed
  in the id="session-length" element.`, async ({ page }) => {
    await page.clock.install();

    const startButton = page.locator("#start_stop");
    const sessionDecrement = page.locator("#session-decrement");
    const breakDecrement = page.locator("#break-decrement");
    const timerLabel = page.locator("#timer-label");
    const timeLeft = page.locator("#time-left");
  
    await expect(breakDecrement).toBeVisible();
    await expect(sessionDecrement).toBeVisible();
    await expect(startButton).toBeVisible();
  
    for (let i = 0; i < 25; i++) {
      await sessionDecrement.click();
    }
  
    for (let i = 0; i < 5; i++) {
      await breakDecrement.click();
    }
  
    await startButton.click();
  
    await expect(timeLeft).toHaveText("01:00");
    
    await page.clock.runFor(60000);
  
    await expect(timeLeft).toHaveText("00:00");
  
    await expect(timerLabel).toHaveText("Break");
    
    await expect(timeLeft).toHaveText("01:00");

    await page.clock.runFor(60000);
  
    await expect(timeLeft).toHaveText("00:00");
  
    await expect(timerLabel).toHaveText("Session");
    
    await expect(timeLeft).toHaveText("01:00");
});
