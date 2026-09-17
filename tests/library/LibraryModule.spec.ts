import { expect, Page, test } from '@playwright/test';
import { AddBookPage } from '../../pages/library/AddBookPage';
import { LoginPage } from '../../pages/common/LoginPage';
import { DataGenerator } from '../../utils/DataGenerator';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 30000 });
};

test.describe('Library Module', () => {
  test('should issue a book to a student', async ({ page }) => {
    test.setTimeout(180000);
    const libraryPage = new AddBookPage(page);
    await login(page);
    const today = new Date();
    await libraryPage.issueBook({
      className: '8',
      section: 'A',
      subject: 'Mathematics',
      studentName: 'Vanya Sharma',
      libraryCardNumber: 'STU-1001',
      bookTitle: 'The Jungle Book',
      remarks: 'Issued for classroom reading and assignment submission.',
      issueDate: today,
      dueDate: new Date(today.getFullYear(), today.getMonth() + 1, Math.min(today.getDate(), 28)),
    });
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await expect(page).toHaveURL(/library/);
  });

  test('should accept an issued book for a student', async ({ page }) => {
    test.setTimeout(120000);
    const libraryPage = new AddBookPage(page);
    await login(page);
    await libraryPage.navigateToStudentIssuedBooks();
    await libraryPage.acceptIssuedBookForStudent('Vanya Sharma');
    await expect(page.locator('tr').filter({ has: page.getByText('Vanya Sharma', { exact: true }) }).first()).toBeVisible();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await expect(page).toHaveURL(/library/);
  });

  test('should issue a book to faculty', async ({ page }) => {
    test.setTimeout(120000);
    const libraryPage = new AddBookPage(page);
    await login(page);
    await libraryPage.issueBookToFaculty({
      bookTitle: 'The Jungle Book',
      facultyName: 'Vanya',
      purpose: 'Faculty reference and classroom reading',
      issueDate: new Date(),
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
      remarks: 'Issued to faculty for academic use.',
    });
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await expect(page).toHaveURL(/library/);
  });

  test('should add a new library book', async ({ page }) => {
    test.setTimeout(120000);
    const libraryPage = new AddBookPage(page);
    const bookCode = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
    const books = [
      { category: 'Fiction', title: 'The Jungle Book', author: 'Rudyard Kipling', isbn: '9780141321035', publisher: 'Penguin Books', edition: 'First Edition', language: 'English' },
      { category: 'Fiction', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', publisher: 'Penguin Classics', edition: 'First Edition', language: 'English' },
      { category: 'Fiction', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', isbn: '9780755331066', publisher: 'Hodder and Stoughton', edition: 'First Edition', language: 'English' },
    ];
    const book = books[Date.now() % books.length];
    const createdDate = new Date();
    await login(page);
    await libraryPage.addLibraryBook({
      category: book.category,
      bookTitle: book.title,
      authorName: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      edition: book.edition,
      language: book.language,
      publishedYear: createdDate.getFullYear(),
      serialNumber: `LIB${bookCode}`,
      copies: 1 + (Number(bookCode.slice(-2)) % 9),
      rackNumber: `R${bookCode.slice(-4)}`,
      shelfNumber: `S${bookCode.slice(-4)}`,
      finePerDay: 1 + (Number(bookCode.slice(-2)) % 20),
      createdDate,
      filePath: DataGenerator.documentImage(`library-book-${bookCode}`),
      description: `${book.title} by ${book.author}. Added to the school library collection.`,
    });
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await expect(page).toHaveURL(/library/);
  });
});
