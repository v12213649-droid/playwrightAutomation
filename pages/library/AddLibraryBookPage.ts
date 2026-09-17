import { expect, Locator, Page } from '@playwright/test';

export interface LibraryBookDetails {
  category: string;
  bookTitle: string;
  authorName: string;
  isbn: string;
  publisher: string;
  edition: string;
  language: string;
  publishedYear: number;
  serialNumber: string;
  copies: number;
  rackNumber: string;
  shelfNumber: string;
  finePerDay: number;
  createdDate: Date;
  description: string;
  filePath: string;
}

export class AddLibraryBookPage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly libraryCard: Locator;
  readonly allBooksTab: Locator;
  readonly addBookButton: Locator;
  readonly categoryDropdown: Locator;
  readonly bookTitleInput: Locator;
  readonly authorNameInput: Locator;
  readonly isbnInput: Locator;
  readonly publisherInput: Locator;
  readonly editionInput: Locator;
  readonly languageInput: Locator;
  readonly publishedYearInput: Locator;
  readonly serialNumberInput: Locator;
  readonly copiesInput: Locator;
  readonly rackNumberInput: Locator;
  readonly shelfNumberInput: Locator;
  readonly finePerDayInput: Locator;
  readonly createdDatePicker: Locator;
  readonly fileInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.libraryCard = page.locator('div.card:has(h3:text-is("Library")), h3:text-is("Library")').first();
    this.allBooksTab = page.locator('[routerlink="/school-management/library/all-books"]').first();
    this.addBookButton = page.locator('button[routerlink="/school-management/library/all-books/add"]').first();

    this.categoryDropdown = page.locator('p-select:visible').first();
    this.bookTitleInput = page.locator('input[formcontrolname="bookTitle"]');
    this.authorNameInput = page.locator('input[formcontrolname="authorName"]');
    this.isbnInput = page.locator('input[formcontrolname="isbn"]');
    this.publisherInput = page.locator('input[formcontrolname="publisher"]');
    this.editionInput = page.locator('input[formcontrolname="edition"]');
    this.languageInput = page.locator('input[formcontrolname="language"]');
    this.publishedYearInput = page.locator('input[formcontrolname="published_year"]').first();
    this.serialNumberInput = page.locator('input[formcontrolname="bookSerialNumber"]');
    this.copiesInput = page.locator('input[formcontrolname="noOfCopies"]');
    this.rackNumberInput = page.locator('input[formcontrolname="rack_number"]');
    this.shelfNumberInput = page.locator('input[formcontrolname="shelf_number"]');
    this.finePerDayInput = page.locator('input[formcontrolname="fine_per_day"]');
    this.createdDatePicker = page.locator('p-datepicker[formcontrolname="createdDate"]');
    this.fileInput = page.locator('form input.file-upload-input, form input[type="file"]').last();
    this.descriptionInput = page.locator('textarea[formcontrolname="description"]');
    this.submitButton = page.getByRole('button', { name: 'Add Book', exact: true }).last();
  }

  async navigateToAddBook() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.libraryCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.libraryCard.click();
    await this.page.waitForTimeout(700);

    await this.allBooksTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.allBooksTab.click({ force: true });
    await this.page.waitForTimeout(500);

    await this.addBookButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addBookButton.click();
    await this.page.waitForTimeout(700);
  }

  private async selectDropdownOption(dropdown: Locator, optionText: string) {
    const trigger = dropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click({ timeout: 15000 });

    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 10000 });
    const option = listbox.getByRole('option', { name: optionText, exact: true }).first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  private async selectCreatedDate(date: Date) {
    const input = this.createdDatePicker.locator('input').first();
    await this.createdDatePicker.locator('button[aria-label="Choose Date"]').first().click();
    await this.page.waitForTimeout(300);

    const day = String(date.getDate());
    const todayCell = this.page.locator('.p-datepicker-calendar td.p-datepicker-today span').first();
    const dateCell = this.page.locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}")`).first();
    const cell = await todayCell.isVisible({ timeout: 2000 }).catch(() => false) ? todayCell : dateCell;
    await cell.scrollIntoViewIfNeeded();
    await cell.click();
    await expect(input).not.toHaveValue('');
  }

  async fillAndSubmit(details: LibraryBookDetails) {
    await this.navigateToAddBook();
    await this.selectDropdownOption(this.categoryDropdown, details.category);
    await this.bookTitleInput.fill(details.bookTitle);
    await this.authorNameInput.fill(details.authorName);
    await this.isbnInput.fill(details.isbn);
    await this.publisherInput.fill(details.publisher);
    await this.editionInput.fill(details.edition);
    await this.languageInput.fill(details.language);
    await this.publishedYearInput.fill(String(details.publishedYear));
    await this.serialNumberInput.fill(details.serialNumber);
    await this.copiesInput.fill(String(details.copies));
    await this.rackNumberInput.fill(details.rackNumber);
    await this.shelfNumberInput.fill(details.shelfNumber);
    await this.finePerDayInput.fill(String(details.finePerDay));
    await this.selectCreatedDate(details.createdDate);
    await this.fileInput.setInputFiles(details.filePath);
    await this.descriptionInput.fill(details.description);

    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
    await this.page.waitForTimeout(1500);
  }
}
