import { expect, test } from '@playwright/test';
import { AddLeavePage } from '../../pages/leave/AddLeavePage';
import { LoginPage } from '../../pages/common/LoginPage';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const LEAVES_COUNT_PER_YEAR = 12;
const IS_PAID = true;

test.describe('Leave Module - Add Leave Type', () => {
  test('should add a leave type', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const leavePage = new AddLeavePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    await leavePage.navigateToLeavePolicy();
    await expect(page).toHaveURL(/.*school-management\/leave\/leave-policy/);

    await leavePage.openAddLeaveType();
    await leavePage.fillLeaveType({
      leaveType: 'Casual Leave',
      leavesCountPerYear: LEAVES_COUNT_PER_YEAR,
      carryForward: 'No',
      isPaid: IS_PAID,
    });

    await expect(leavePage.leavesCountPerYearInput).toHaveValue(String(LEAVES_COUNT_PER_YEAR));
    await leavePage.addLeave();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(20000);
  });
});
