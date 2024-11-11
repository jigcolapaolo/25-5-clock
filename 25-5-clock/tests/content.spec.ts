import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test(`I can see an element with id="break-label"
  that contains a string (e.g. “Break Length”).`, async ({ page }) => {
    await expect(page.locator('#break-label')).toContainText('Break Length');
});

test(`I can see an element with id="session-label"
  that contains a string (e.g. "Session Length”).`, async ({ page }) => {
    await expect(page.locator('#session-label')).toContainText('Session Length');
})

test(`I can see two clickable elements with corresponding IDs:
  id="break-decrement" and id="session-decrement".`, async ({ page }) => {
    const breakDecrement = page.locator('#break-decrement');
    const sessionDecrement = page.locator('#session-decrement');

    await expect(breakDecrement).toBeVisible();
    await expect(sessionDecrement).toBeVisible();

    const breakTagName = await breakDecrement.evaluate(el => el.tagName.toLowerCase());
    const sessionTagName = await sessionDecrement.evaluate(el => el.tagName.toLowerCase());
    expect(breakTagName && sessionTagName).toBe('button');
})

test(`I can see two clickable elements with corresponding IDs:
  id="break-increment" and id="session-increment".`, async ({ page }) => {
    const breakIncrement = page.locator('#break-increment');
    const sessionIncrement = page.locator('#session-increment');

    await expect(breakIncrement).toBeVisible();
    await expect(sessionIncrement).toBeVisible();

    const breakTagName = await breakIncrement.evaluate(el => el.tagName.toLowerCase());
    const sessionTagName = await sessionIncrement.evaluate(el => el.tagName.toLowerCase());
    expect(breakTagName && sessionTagName).toBe('button');
})

test(`I can see an element, with corresponding id="break-length",
  which by default (on load) displays a value of 5.`, async ({ page }) => {
  await expect(page.locator('#break-length')).toHaveText('5');
});

test(`I can see an element, with corresponding id="session-length",
  which by default displays a value of 25.`, async ({ page }) => {
  await expect(page.locator('#session-length')).toHaveText('25');
});

test(`I can see an element, with corresponding id="timer-label",
  that contains a string indicating a session is initialized (e.g. "Session").`, async ({ page }) => {
  await expect(page.locator('#timer-label')).toContainText('Session');
})

test(`I can see an element with corresponding id="time-left".
  NOTE: Paused or running, the value in this field should always be displayed
  in mm:ss format (i.e. 25:00).`, async ({ page }) => {
  await expect(page.locator('#time-left')).toHaveText('25:00');
})

test(`I can see a clickable element with corresponding id="start_stop".`, async ({ page }) => {
  await expect(page.locator('#start_stop')).toBeVisible();
})

test(`I can see a clickable element with corresponding id="reset".`, async ({ page }) => {
  await expect(page.locator('#reset')).toBeVisible();
})


