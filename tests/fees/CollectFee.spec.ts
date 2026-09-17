import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { CollectFeePage } from '../../pages/fees/CollectFeePage';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const COLLECT_CLASS = '9';
const COLLECT_SECTION = 'A';
const COLLECT_STUDENT = 'Om Agarwal';
const PAYMENT_MODE = 'Cash';
const PAYMENT_DAY = 17;

const COLLECT_FEE_DATA = {
  className: COLLECT_CLASS,
  section: COLLECT_SECTION,
  studentName: COLLECT_STUDENT,
  paymentMode: PAYMENT_MODE,
  paymentDay: PAYMENT_DAY,
};

const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
};

test.describe('Collect Fee Module', () => {
  test('should collect a fee payment', async ({ page }) => {
    test.setTimeout(180000);
    const collectFeePage = new CollectFeePage(page);

    await login(page);
    await collectFeePage.navigateToCollectFees();
    await collectFeePage.searchStudent(COLLECT_FEE_DATA);
    await collectFeePage.collectPayment(COLLECT_FEE_DATA);
    await collectFeePage.expectPaymentActionsVisible();
    await collectFeePage.closePaymentReceipt();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
  });
});
