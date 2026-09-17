import { expect, test } from '@playwright/test';
import { AddBookPage } from '../../pages/library/AddBookPage';
import { LoginPage } from '../../pages/common/LoginPage';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';


const FACULTY_ISSUE_DATA = {
  bookTitle: 'The Jungle Book',
  facultyName: 'Vanya',
  purpose: 'Faculty reference and classroom reading',
  issueDate: new Date(),
  dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  remarks: 'Issued to faculty for academic use.',
};

test('should issue a book to faculty', async ({ page }) => {
  test.setTimeout(120000);
  const loginPage = new LoginPage(page);
  const bookPage = new AddBookPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  await bookPage.issueBookToFaculty(FACULTY_ISSUE_DATA);
  await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
  await page.waitForTimeout(10000);
});
