import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { FEE_DURATION, FEE_STATUS, FEE_TYPE, FeeModule } from '../../pages/fees/FeeModule';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const ADD_FEE_TYPE_NAME = 'tution fee';
const ADD_FEE_TYPE_DESCRIPTION = 'not availbale';
const EDIT_FEE_TYPE_NAME = 'tution';
const EDITED_FEE_TYPE_NAME = 'tution updated';
const DELETE_FEE_TYPE_NAME = 'Tuition Fee';

const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
};

test.describe.serial('Fee Type Module', () => {
  test('should add a fee type', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeTypes();
    await feeModule.addFeeType({
      feeType: FEE_TYPE.OTHER,
      customName: ADD_FEE_TYPE_NAME,
      duration: FEE_DURATION.MONTHLY,
      description: ADD_FEE_TYPE_DESCRIPTION,
      status: FEE_STATUS.ACTIVE,
    });
    await feeModule.expectFeeTypeVisible(ADD_FEE_TYPE_NAME);
    await expect(page).toHaveURL(/fee-management\/fee-type/);
  });

  test('should edit a fee type', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeTypes();
    await feeModule.editFeeType(EDIT_FEE_TYPE_NAME, {
      feeType: FEE_TYPE.OTHER,
      customName: EDITED_FEE_TYPE_NAME,
      duration: FEE_DURATION.ANNUALLY,
      description: ADD_FEE_TYPE_DESCRIPTION,
      status: FEE_STATUS.ACTIVE,
    });
    await feeModule.expectFeeTypeVisible(EDITED_FEE_TYPE_NAME);
    await expect(page).toHaveURL(/fee-management\/fee-type/);
  });

  test('should delete a fee type', async ({ page }) => {
    test.setTimeout(180000);
    const feeModule = new FeeModule(page);
    await login(page);
    await feeModule.navigateToFeeTypes();
    const deletedName = await feeModule.deleteFeeType(DELETE_FEE_TYPE_NAME);
    await feeModule.expectFeeTypeHidden(deletedName);
  });
});
