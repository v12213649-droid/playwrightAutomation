import { expect, test } from '@playwright/test';
import { AddLibraryBookPage } from '../../pages/library/AddLibraryBookPage';
import { LoginPage } from '../../pages/common/LoginPage';
import { DataGenerator } from '../../utils/DataGenerator';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';


const REAL_BOOKS = [
  {
    category: 'Fiction',
    title: 'The Jungle Book',
    author: 'Rudyard Kipling',
    isbn: '9780141321035',
    publisher: 'Penguin Books',
    edition: 'First Edition',
    language: 'English',
  },
  {
    category: 'Fiction',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    publisher: 'Penguin Classics',
    edition: 'First Edition',
    language: 'English',
  },
  {
    category: 'Fiction',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    isbn: '9780755331066',
    publisher: 'Hodder and Stoughton',
    edition: 'First Edition',
    language: 'English',
  },
];

test.describe('Library Add Book', () => {
  test('should add a new book with generated data and upload a file', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const libraryBookPage = new AddLibraryBookPage(page);
    const bookCode = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
    const book = REAL_BOOKS[Date.now() % REAL_BOOKS.length];
    const copies = 1 + (Number(bookCode.slice(-2)) % 9);
    const rackNumber = `R${bookCode.slice(-4)}`;
    const shelfNumber = `S${bookCode.slice(-4)}`;
    const createdDate = new Date();

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    await libraryBookPage.fillAndSubmit({
      category: book.category,
      bookTitle: book.title,
      authorName: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      edition: book.edition,
      language: book.language,
      publishedYear: createdDate.getFullYear(),
      serialNumber: `LIB${bookCode}`,
      copies,
      rackNumber,
      shelfNumber,
      finePerDay: 1 + (Number(bookCode.slice(-2)) % 20),
      createdDate,
      filePath: DataGenerator.documentImage(`library-book-${bookCode}`),
      description: `${book.title} by ${book.author}. Added to the school library collection.`,
    });

    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });
});

