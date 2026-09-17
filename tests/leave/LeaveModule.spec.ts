import path from 'path';
import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { AddLeavePage } from '../../pages/leave/AddLeavePage';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
};

test.describe('Leave Module', () => {
  test('should add a leave type', async ({ page }) => {
    test.setTimeout(120000);
    const leavePage = new AddLeavePage(page);
    await login(page);
    await leavePage.navigateToLeavePolicy();
    await expect(page).toHaveURL(/.*school-management\/leave\/leave-policy/);
    await leavePage.openAddLeaveType();
    await leavePage.fillLeaveType({
      leaveType: 'Casual Leave',
      leavesCountPerYear: 12,
      carryForward: 'No',
      isPaid: true,
    });
    await expect(leavePage.leavesCountPerYearInput).toHaveValue('12');
    await leavePage.addLeave();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await expect(leavePage.addLeaveTypeButton).toBeVisible();
  });

  test('should apply for leave with dates, reason, and attachment', async ({ page }) => {
    test.setTimeout(120000);
    const leavePage = new AddLeavePage(page);
    await login(page);
    await leavePage.navigateToApplyLeave();
    await expect(page).toHaveURL(/.*school-management\/leave\/apply-leave/);
    await leavePage.fillApplyLeave({
      category: 'Academic',
      employee: 'Preeti kumari',
      leaveType: 'Casual Leave',
      startDate: '15/09/2026',
      endDate: '16/09/2026',
      reason: 'Personal work',
      attachmentPath: path.resolve('testdata/profile.jpg'),
    });
    await expect(leavePage.startDateInput).toHaveValue('15/09/2026');
    await expect(leavePage.endDateInput).toHaveValue('16/09/2026');
    await expect(leavePage.reasonTextarea).toHaveValue('Personal work');
    await leavePage.applyLeave();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await expect(page).toHaveURL(/.*school-management\/leave\/apply-leave/);
  });
});
