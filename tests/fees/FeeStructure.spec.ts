import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { FeeStructurePage } from '../../pages/fees/FeeStructurePage';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const FEE_CLASS = '9';
const FEE_TYPE = 'Other-1789556997304';

const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
};

test.describe.serial('Fee Structure Module', () => {
  test('should add a fee structure', async ({ page }) => {
    test.setTimeout(180000);
    const feeStructurePage = new FeeStructurePage(page);
    await login(page);
    await feeStructurePage.navigateToFeeStructure();
    const feeType = await feeStructurePage.addFee({
      className: FEE_CLASS,
      feeType: FEE_TYPE,
      amount: 3000,
      lateFeePerDay: 500,
      gracePeriodDays: 4,
    });
    await feeStructurePage.expectFeeVisible(FEE_CLASS);
    expect(feeType).toBe(FEE_TYPE);
    await expect(page).toHaveURL(/fee-management\/fee-structure/);
  });

  test('should edit a fee structure', async ({ page }) => {
    test.setTimeout(180000);
    const feeStructurePage = new FeeStructurePage(page);
    await login(page);
    await feeStructurePage.navigateToFeeStructure();
    await feeStructurePage.editFee(FEE_CLASS, {
      className: '7',
      amount: 23333,
      lateFeePerDay: 500,
      gracePeriodDays: 5,
      startDateDay: 17,
      endDateDay: 30,
      endDateNextMonth: true,
    });
    await expect(page.locator('tr').filter({ hasText: '₹23333' }).first()).toBeVisible();
  });

  test.only('should delete a fee structure', async ({ page }) => {
    test.setTimeout(180000);
    const feeStructurePage = new FeeStructurePage(page);
    await login(page);
    await feeStructurePage.navigateToFeeStructure();
    const deletedFeeType = await feeStructurePage.deleteFee(FEE_CLASS);
    await feeStructurePage.expectFeeHidden(deletedFeeType);
    await expect(page).toHaveURL(/fee-management\/fee-structure/);
  });
});
