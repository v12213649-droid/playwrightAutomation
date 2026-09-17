import { expect, test } from '@playwright/test';
import { AddBookPage } from '../../pages/library/AddBookPage';
import { LoginPage } from '../../pages/common/LoginPage';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';


const BOOK_ISSUE_DATA = {
  className: '8',
  section: 'A',
  subject: 'Mathematics',
  studentName: 'Vanya Sharma',
  libraryCardNumber: 'STU-1001',
  bookTitle: 'The Jungle Book',
  remarks: 'Issued for classroom reading and assignment submission.',
};

test.describe('Library Book Issue', () => {
  test('should issue a book to a student with class, section, book selection, and dates', async ({ page }) => {
    test.setTimeout(180000);

    const loginPage = new LoginPage(page);
    const addBookPage = new AddBookPage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);

    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, Math.min(today.getDate(), 28));

    await addBookPage.issueBook({
      ...BOOK_ISSUE_DATA,
      issueDate: today,
      dueDate: nextMonth,
    });

    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(5000);
  });
});

