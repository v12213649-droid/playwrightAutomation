import { test } from '@playwright/test';

export const LOGIN_EMAIL = 'vikasp@yopmail.com';
export const LOGIN_PASSWORD = 'Demo@1234';

// Intentionally no global waitForTimeout; use UI assertions instead.
test.afterEach(async () => {
  // no-op
});
