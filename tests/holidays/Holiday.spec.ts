import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { HolidayPage } from '../../pages/holidays/HolidayPage';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const futureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 45 + Math.floor(Math.random() * 30));
  return date.toLocaleDateString('en-GB');
};

const HOLIDAY_DATE = futureDate();
const HOLIDAY_TYPE = 'National Holiday';
const APPLICABLE_TO = ['All'];
const HOLIDAY_NAME = `Automation Holiday ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const UPDATED_HOLIDAY_NAME = `${HOLIDAY_NAME} Updated`;

const holidayDetails = (name: string) => ({
  name,
  date: HOLIDAY_DATE,
  type: HOLIDAY_TYPE,
  applicableTo: APPLICABLE_TO,
  description: 'Holiday created by the automated Holidays module test.',
});

test.describe.serial('Holidays Module', () => {
  test('should add, edit, and delete a holiday', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const holidayPage = new HolidayPage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    await holidayPage.navigateToHolidayCalendar();
    await holidayPage.openAddHoliday();
    await holidayPage.fillHoliday(holidayDetails(HOLIDAY_NAME));
    await expect(holidayPage.holidayNameInput).toHaveValue(HOLIDAY_NAME);
    await expect(holidayPage.startDateInput).toHaveValue(HOLIDAY_DATE);
    await holidayPage.addHoliday();
    await holidayPage.expectNoValidationErrors();

    await holidayPage.openList();
    await holidayPage.expectHolidayVisible(HOLIDAY_NAME);

    await holidayPage.editHoliday(HOLIDAY_NAME, holidayDetails(UPDATED_HOLIDAY_NAME));
    await holidayPage.expectNoValidationErrors();
    await holidayPage.expectHolidayVisible(UPDATED_HOLIDAY_NAME);

    await holidayPage.deleteHoliday(UPDATED_HOLIDAY_NAME);
    await holidayPage.expectNoValidationErrors();
    await holidayPage.expectHolidayHidden(UPDATED_HOLIDAY_NAME);
  });
});
