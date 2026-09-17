import path from 'path';
import { expect, test } from '@playwright/test';
import { AddLeavePage } from '../../pages/leave/AddLeavePage';
import { LoginPage } from '../../pages/common/LoginPage';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const APPLY_LEAVE_CATEGORY = 'Academic';
const APPLY_LEAVE_EMPLOYEE = 'Preeti kumari';
const APPLY_LEAVE_TYPE = 'Casual Leave';
const APPLY_LEAVE_START_DATE = '15/09/2026';
const APPLY_LEAVE_END_DATE = '16/09/2026';
const APPLY_LEAVE_REASON = 'Personal work';
const APPLY_LEAVE_ATTACHMENT = path.resolve('testdata/profile.jpg');

test.describe('Leave Module - Apply Leave', () => {
  test('should apply for leave with dates, reason, and attachment', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const leavePage = new AddLeavePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    await leavePage.navigateToApplyLeave();
    await expect(page).toHaveURL(/.*school-management\/leave\/apply-leave/);

    await leavePage.fillApplyLeave({
      category: APPLY_LEAVE_CATEGORY,
      employee: APPLY_LEAVE_EMPLOYEE,
      leaveType: APPLY_LEAVE_TYPE,
      startDate: APPLY_LEAVE_START_DATE,
      endDate: APPLY_LEAVE_END_DATE,
      reason: APPLY_LEAVE_REASON,
      attachmentPath: APPLY_LEAVE_ATTACHMENT,
    });

    await expect(leavePage.startDateInput).toHaveValue(APPLY_LEAVE_START_DATE);
    await expect(leavePage.endDateInput).toHaveValue(APPLY_LEAVE_END_DATE);
    await expect(leavePage.reasonTextarea).toHaveValue(APPLY_LEAVE_REASON);
    await leavePage.applyLeave();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });
});