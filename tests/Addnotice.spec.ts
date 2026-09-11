import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddNoticePage } from '../pages/AddNoticePage';
import { DataGenerator } from '../utils/DataGenerator';

const LOGIN_EMAIL = 'vikasp@yopmail.com';
const LOGIN_PASSWORD = 'Demo@1234';

test.describe('Notice Module - Add Notice', () => {
  test('should create and publish a notice following the sequential steps with current date and detailed description', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const noticePage = new AddNoticePage(page);

    // ==========================================
    // 0. Login with authorized credentials
    // ==========================================
    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    // ==========================================
    // 1. Element 1: Notice module card on Manage dashboard
    // ==========================================
    console.log('Step 1: Navigating to Notice module...');
    await noticePage.navigateToNoticeModule();
    await expect(page).toHaveURL(/.*school-management\/notice/);

    // ==========================================
    // 2. Element 2: <button routerlink="/school-management/notice/add-notice" class="add-btn">Add notice</button>
    // ==========================================
    console.log('Step 2: Clicking Add Notice button...');
    await noticePage.clickAddNotice();
    await expect(page).toHaveURL(/.*school-management\/notice\/add-notice/);

    // ==========================================
    // Generate realistic, unique title & detailed description
    // ==========================================
    const noticeTitle = DataGenerator.noticeTitle();
    const detailedDescription = DataGenerator.detailedNoticeDescription(noticeTitle);
    const noticeDocPath = DataGenerator.randomJpgImage('notice-doc');

    console.log(`Generating notice: "${noticeTitle}"`);
    console.log(`Description character length: ${detailedDescription.length} characters`);

    // ==========================================
    // 3. Element 3: Notice Title input
    // ==========================================
    console.log('Step 3: Entering notice title...');
    await noticePage.fillTitle(noticeTitle);
    await expect(noticePage.titleInput).toHaveValue(noticeTitle);

    // ==========================================
    // 4. Element 4: Detailed description textarea (description should be greater)
    // ==========================================
    console.log('Step 4: Entering detailed description...');
    await noticePage.fillDescription(detailedDescription);
    await expect(noticePage.descriptionTextarea).toHaveValue(detailedDescription);

    // ==========================================
    // 5. Element 5: Send SMS notification checkbox
    // ==========================================
    console.log('Step 5: Verifying Send SMS checkbox...');
    await noticePage.checkSendSms();

    // ==========================================
    // 6 & 7. Element 6 & 7: Category dropdown & selection (General)
    // ==========================================
    console.log('Step 6 & 7: Selecting notice category (General)...');
    await noticePage.selectCategory('General');

    // ==========================================
    // 8. Element 8: Upload document / image
    // ==========================================
    console.log(`Step 8: Uploading notice attachment (${noticeDocPath})...`);
    await noticePage.uploadAttachment(noticeDocPath);

    // ==========================================
    // 9. Element 9: Signature input (e.g., Principal)
    // ==========================================
    console.log('Step 9: Entering authority signature (Principal)...');
    await noticePage.fillSignature('Principal');
    await expect(noticePage.signatureInput).toHaveValue('Principal');

    // ==========================================
    // 10. Element 10: Notice Date (Current date select)
    // ==========================================
    console.log('Step 10: Selecting notice date (Current Date)...');
    await noticePage.selectNoticeDateCurrent();
    await expect(noticePage.noticeDateInput).not.toHaveValue('');

    // ==========================================
    // 11. Element 11: Validity Start Date (Current Date)
    // ==========================================
    console.log('Step 11: Selecting validity start date...');
    await noticePage.selectValidityStartDate();
    await expect(noticePage.validityStartInput).not.toHaveValue('');

    // ==========================================
    // 12. Element 12: Validity End Date (7 days from today)
    // ==========================================
    console.log('Step 12: Selecting validity end date...');
    await noticePage.selectValidityEndDate(7);
    await expect(noticePage.validityEndInput).not.toHaveValue('');

    // ==========================================
    // 13. Element 13: Preview and Publish button
    // ==========================================
    console.log('Step 13: Clicking Preview and Publish...');
    await noticePage.clickPreviewAndPublish();

    // ==========================================
    // 14 & 15. Element 14 & 15: Select Template (Formal Template)
    // ==========================================
    console.log('Step 14 & 15: Choosing Formal Template...');
    await noticePage.selectTemplate('Formal Template');

    // ==========================================
    // 16. Element 16: Confirm and Publish button
    // ==========================================
    console.log('Step 16: Clicking Confirm and Publish...');
    await noticePage.confirmAndPublish();

    // Wait and verify completion
    await page.waitForTimeout(2000);
    console.log(`Notice successfully published: "${noticeTitle}"`);
  });
});
