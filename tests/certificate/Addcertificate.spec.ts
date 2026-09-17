import { expect, test } from '@playwright/test';
import { AddCertificatePage } from '../../pages/certificate/AddCertificatePage';
import { LoginPage } from '../../pages/common/LoginPage';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';


const CERTIFICATE_DATA = {
  templateName: 'Royal Indigo Achievement',
  certificateType: 'Achievement',
  title: 'Academic Achievement Certificate',
  className: '8',
  section: 'A',
  studentName: 'Om',
  issueDate: new Date(),
  reason: 'Outstanding academic performance and consistent participation in school activities.',
};

test('should generate a certificate for the configured student', async ({ page }) => {
  test.setTimeout(120000);
  const loginPage = new LoginPage(page);
  const certificatePage = new AddCertificatePage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  await certificatePage.generateCertificate(CERTIFICATE_DATA);
  await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
  await page.waitForTimeout(10000);
});
