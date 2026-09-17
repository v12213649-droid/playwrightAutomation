import { expect, test } from '@playwright/test';
import { AddBookPage } from '../../pages/library/AddBookPage';
import { LoginPage } from '../../pages/common/LoginPage';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const ISSUED_BOOK_STUDENT = 'Vanya Sharma';

test.describe('Library Issued Books', () => {
  test('should accept an issued book for the configured student', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const addBookPage = new AddBookPage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    await addBookPage.navigateToStudentIssuedBooks();
    await addBookPage.acceptIssuedBookForStudent(ISSUED_BOOK_STUDENT);

    await expect(
      page.locator('tr').filter({ has: page.getByText(ISSUED_BOOK_STUDENT, { exact: true }) }).first()
    ).toBeVisible();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });
});