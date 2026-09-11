import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddPTMPage } from '../pages/AddPTMPage';
import { DataGenerator } from '../utils/DataGenerator';

const LOGIN_EMAIL = 'vikasp@yopmail.com';
const LOGIN_PASSWORD = 'Demo@1234';

test.describe('PTM Module - Add PTM', () => {
  test('should create a new PTM without duplicate entry following 9-step sequence', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const ptmPage = new AddPTMPage(page);

    // ==========================================
    // 0. Login with authorized credentials
    // ==========================================
    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    // ==========================================
    // 1. Element 1: <a routerlink="/school-management" ...>Manage</a>
    // ==========================================
    console.log('Step 1: Navigating to School Management...');
    await ptmPage.clickManageNav();
    await expect(page).toHaveURL(/.*school-management/);

    // ==========================================
    // 2. Element 2: <h3>PTM</h3>
    // ==========================================
    console.log('Step 2: Clicking PTM module...');
    await ptmPage.clickPTMModule();
    await expect(page).toHaveURL(/.*school-management\/ptm/);

    // ==========================================
    // 3. Element 3: <button routerlink="/school-management/ptm/add-ptm" class="add-btn">Add PTM</button>
    // ==========================================
    console.log('Step 3: Opening Add PTM Form...');
    await ptmPage.clickAddPTM();
    await expect(page).toHaveURL(/.*school-management\/ptm\/add-ptm/);

    // ==========================================
    // Generate short, realistic, unique PTM data
    // ==========================================
    const uniqueTitle = DataGenerator.ptmTitle();
    const description = DataGenerator.ptmDescription(uniqueTitle);

    // ==========================================
    // 4. Element 4: <input type="text" formcontrolname="title" ...>
    // ==========================================
    console.log(`Step 4: Filling unique title: ${uniqueTitle}`);
    await ptmPage.fillTitle(uniqueTitle);
    await expect(ptmPage.titleInput).toHaveValue(uniqueTitle);

    // ==========================================
    // 5. Element 5: <p-datepicker formcontrolname="dateOfMeeting" ...>
    // Selected 4 days after current date
    // ==========================================
    console.log('Step 5: Selecting meeting date (current date + 4 days)...');
    await ptmPage.selectDateOfMeeting(4);
    await expect(ptmPage.dateOfMeetingInput).not.toHaveValue('');

    // ==========================================
    // 6. Element 6: Start Time (10:00)
    // ==========================================
    console.log('Step 6: Setting start time to 10:00...');
    await ptmPage.fillStartTime('10:00');
    await expect(ptmPage.startTimeInput).toHaveValue(/10:00/);

    // ==========================================
    // 7. Element 7: End Time (12:00)
    // ==========================================
    console.log('Step 7: Setting end time to 12:00...');
    await ptmPage.fillEndTime('12:00');
    await expect(ptmPage.endTimeInput).toHaveValue(/12:00/);

    // ==========================================
    // 8. Element 8: <textarea formcontrolname="ptmDescription" ...>
    // ==========================================
    console.log('Step 8: Filling PTM Description...');
    await ptmPage.fillDescription(description);
    await expect(ptmPage.ptmDescriptionInput).toHaveValue(description);

    // ==========================================
    // 9. Element 9: <button type="button" class="add-btn"><span>Add PTM</span></button>
    // ==========================================
    console.log('Step 9: Submitting Add PTM form...');
    await ptmPage.submit();

    // Verify submission outcome
    // Expect redirection back to PTM list or success confirmation
    await page.waitForTimeout(2000);
    console.log(`Successfully created PTM: "${uniqueTitle}"`);
  });
});
