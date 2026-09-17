import { Page, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import {
  FEE_DURATION,
  FEE_STATUS,
  FEE_TYPE,
  FeeModule,
} from '../../pages/fees/FeeModule';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
};

test.describe.serial('Fee Module', () => {
  test('should add a fee structure', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeStructure();

    const className = '9';
    const feeType = await feeModule.addFeeStructure({
      className,
      feeType: 'Random Fee Type',
      amount: 15000,
      lateFeePerDay: 50,
      gracePeriodDays: 3,
    });

    await feeModule.expectFeeStructureVisible(className);
    void feeType;
  });

  test('should edit a fee structure', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeStructure();
    await feeModule.editFirstFeeStructure('6', {
      className: '9',
      feeType: 'Tuition Fee',
      amount: 2000,
      lateFeePerDay: 75,
      gracePeriodDays: 5,
    });
  });

  test('should delete a fee structure', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeStructure();
    const feeType = await feeModule.deleteFirstFeeStructure('6');
    await feeModule.expectFeeStructureHidden(feeType);
  });

  test('should add a fee type', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    const feeName = 'Tuition Fee';
    await login(page);
    await feeModule.navigateToFeeTypes();
    await feeModule.addFeeType({
      feeType: FEE_TYPE.OTHER,
      customName: feeName,
      duration: FEE_DURATION.MONTHLY,
      description: `Auto-created fee type ${feeName}`,
      status: FEE_STATUS.ACTIVE,
    });
    await feeModule.expectFeeTypeVisible(feeName);
  });

  test('should edit a fee type', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    const currentName = 'Academic';
    const updatedName = `Academic-${Date.now()}-Updated`;
    await login(page);
    await feeModule.navigateToFeeTypes();
    await feeModule.editFeeType(currentName, {
      feeType: FEE_TYPE.ACADEMIC,
      customName: updatedName,
      duration: FEE_DURATION.MONTHLY,
      description: `Edited fee type ${updatedName}`,
      status: FEE_STATUS.ACTIVE,
    });
    await feeModule.expectFeeTypeVisible(updatedName);
  });

  test('should delete a fee type', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeTypes();
    const feeTypeName = await feeModule.deleteFeeType();
    await feeModule.expectFeeTypeHidden(feeTypeName);
  });
});
