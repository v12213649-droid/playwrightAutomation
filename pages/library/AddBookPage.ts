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

export interface BookIssueDetails {
  className: string; // '5' to '10'
  section: string; // 'A' or any visible option
  subject?: string; // e.g. 'Mathematics'
  studentName?: string; // exact visible student name
  libraryCardNumber?: string;
  bookTitle: string; // exact title from the checkbox list
  remarks?: string;
  issueDate?: Date;
  dueDate?: Date;
}

export interface FacultyBookIssueDetails {
  bookTitle: string;
  facultyName: string;
  purpose: string;
  issueDate: Date;
  dueDate: Date;
  remarks: string;
}

export class AddBookPage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly libraryModuleCard: Locator;
  readonly issueBookButton: Locator;
  readonly issuedBooksStudentTab: Locator;
  readonly issueBookFacultyButton: Locator;
  readonly issuedBooksFacultyTab: Locator;
  readonly classDropdown: Locator;
  readonly sectionDropdown: Locator;
  readonly subjectDropdown: Locator;
  readonly studentDropdown: Locator;
  readonly libraryCardNumberInput: Locator;
  readonly issueDateInput: Locator;
  readonly dueDateInput: Locator;
  readonly bookIssueList: Locator;
  readonly remarksTextarea: Locator;
  readonly submitButton: Locator;
  readonly facultyBookIssueList: Locator;
  readonly facultyDropdown: Locator;
  readonly purposeInput: Locator;
  readonly facultyIssueDateInput: Locator;
  readonly facultyDueDateInput: Locator;
  readonly facultyRemarksTextarea: Locator;
  readonly facultySubmitButton: Locator;
  readonly allBooksTab: Locator;
  readonly addLibraryBookButton: Locator;
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
  readonly addLibraryBookSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.libraryModuleCard = page.locator('div.card:has(h3:text-is("Library")), h3:text-is("Library")').first();
    this.issueBookButton = page.locator('button.add-btn:has-text("Issue book to student"), button[routerlink*="/issue"]').first();
    this.issuedBooksStudentTab = page.locator('[routerlink="/school-management/library/student-issued-books"]').first();
    this.issueBookFacultyButton = page.locator('button[routerlink="/school-management/library/faculty-issued-books/issue"]').first();
    this.issuedBooksFacultyTab = page.locator('[routerlink="/school-management/library/faculty-issued-books"]').first();

    this.classDropdown = page.locator('p-select[formcontrolname="classId"]');
    this.sectionDropdown = page.locator('p-select[formcontrolname="sectionId"]');
    this.subjectDropdown = page.locator('p-select[formcontrolname="subjectId"]');
    this.studentDropdown = page.locator('p-select[formcontrolname="studentId"]');
    this.libraryCardNumberInput = page.locator('input[formcontrolname="libraryCardNumber"]');
    this.issueDateInput = page.locator('p-datepicker[formcontrolname="issueDate"] input').first();
    this.dueDateInput = page.locator('p-datepicker[formcontrolname="submissionDate"] input').first();
    this.bookIssueList = page.locator('p-multiselect[formcontrolname="bookIssueList"]');
    this.remarksTextarea = page.locator('textarea[formcontrolname="description"]');
    this.submitButton = page.locator('button.add-btn:has-text("Submit"), button:has-text("Submit")').last();
    this.facultyBookIssueList = page.locator('p-multiselect[formcontrolname="bookIssueList"]');
    this.facultyDropdown = page.locator('p-select[formcontrolname="facultyName"]');
    this.purposeInput = page.locator('input[formcontrolname="purpose"]');
    this.facultyIssueDateInput = page.locator('p-datepicker[formcontrolname="issueDate"] input').first();
    this.facultyDueDateInput = page.locator('p-datepicker[formcontrolname="submissionDate"] input').first();
    this.facultyRemarksTextarea = page.locator('textarea[formcontrolname="description"]');
    this.facultySubmitButton = page.getByRole('button', { name: 'Submit', exact: true }).last();
    this.allBooksTab = page.locator('[routerlink="/school-management/library/all-books"]').first();
    this.addLibraryBookButton = page.locator('button[routerlink="/school-management/library/all-books/add"]').first();
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
    this.addLibraryBookSubmitButton = page.getByRole('button', { name: 'Add Book', exact: true }).last();
  }

  async navigateToLibraryIssueForm() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.libraryModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.libraryModuleCard.click();
    await this.page.waitForTimeout(700);

    await this.issueBookButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.issueBookButton.scrollIntoViewIfNeeded();
    await this.issueBookButton.click({ timeout: 20000 });
    await this.page.waitForTimeout(500);
  }

  async navigateToAddBook() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);
    await this.libraryModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.libraryModuleCard.click();
    await this.page.waitForTimeout(700);
    await this.allBooksTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.allBooksTab.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.addLibraryBookButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addLibraryBookButton.click();
    await this.page.waitForTimeout(700);
  }

  private async selectLibraryBookCategory(category: string) {
    const trigger = this.categoryDropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click({ timeout: 15000 });
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 10000 });
    const option = listbox.getByRole('option', { name: category, exact: true }).first();
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

  async addLibraryBook(details: LibraryBookDetails) {
    await this.navigateToAddBook();
    await this.selectLibraryBookCategory(details.category);
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
    await this.addLibraryBookSubmitButton.scrollIntoViewIfNeeded();
    await this.addLibraryBookSubmitButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.addLibraryBookSubmitButton).toBeEnabled();
    await this.addLibraryBookSubmitButton.click();
    await this.page.waitForTimeout(1500);
  }

  async navigateToStudentIssuedBooks() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.libraryModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.libraryModuleCard.click();
    await this.page.waitForTimeout(700);

    await this.issuedBooksStudentTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.issuedBooksStudentTab.scrollIntoViewIfNeeded();
    await this.issuedBooksStudentTab.click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  async acceptIssuedBookForStudent(studentName: string) {
    const studentRow = this.page.locator('tr').filter({
      has: this.page.getByText(studentName, { exact: true }),
    }).first();

    await studentRow.waitFor({ state: 'visible', timeout: 20000 });
    const acceptButton = studentRow.locator('button.accept-btn').filter({ hasText: /^\s*Accept\s*$/ }).first();
    await acceptButton.waitFor({ state: 'visible', timeout: 10000 });
    await acceptButton.click();

    const confirmAcceptButton = this.page
      .locator('button.btn-accept')
      .filter({ hasText: /^\s*Yes, Accept\s*$/ })
      .first();
    await confirmAcceptButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmAcceptButton.click();
    await this.page.waitForTimeout(1000);
  }

  async navigateToFacultyIssueForm() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);
    await this.libraryModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.libraryModuleCard.click();
    await this.page.waitForTimeout(700);
    await this.issuedBooksFacultyTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.issuedBooksFacultyTab.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.issueBookFacultyButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.issueBookFacultyButton.click();
    await this.page.waitForTimeout(700);
  }

  private async selectFacultyBook(bookTitle: string) {
    const trigger = this.facultyBookIssueList.locator('.p-multiselect-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const option = this.page.locator('li[role="option"]').filter({ hasText: new RegExp(`^\\s*${escapeRegExp(bookTitle)}\\s*$`, 'i') }).first();
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await this.page.locator('body').click({ position: { x: 20, y: 20 } });
  }

  private async selectFacultyOption(optionText: string) {
    const trigger = this.facultyDropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 10000 });
    const option = listbox.getByRole('option', { name: optionText, exact: true }).first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  private async selectFacultyDate(input: Locator, date: Date) {
    await input.locator('xpath=ancestor::p-datepicker[1]//button').first().click();
    await this.page.waitForTimeout(300);
    const day = String(date.getDate());
    const cell = this.page.locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}")`).first();
    await cell.waitFor({ state: 'visible', timeout: 10000 });
    await cell.click();
    await expect(input).not.toHaveValue('');
  }

  async issueBookToFaculty(details: FacultyBookIssueDetails) {
    await this.navigateToFacultyIssueForm();
    await this.selectFacultyBook(details.bookTitle);
    await this.selectFacultyOption(details.facultyName);
    await this.purposeInput.fill(details.purpose);
    await this.selectFacultyDate(this.facultyIssueDateInput, details.issueDate);
    await this.selectFacultyDate(this.facultyDueDateInput, details.dueDate);
    await this.facultyRemarksTextarea.fill(details.remarks);
    await this.facultySubmitButton.scrollIntoViewIfNeeded();
    await this.facultySubmitButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.facultySubmitButton).toBeEnabled();
    await this.facultySubmitButton.click();
    await this.page.waitForTimeout(1500);
  }

  private async openSelectDropdown(dropdown: Locator) {
    const trigger = dropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click({ timeout: 15000 });
    await this.page.waitForTimeout(200);
  }

  private async pickDropdownOption(dropdown: Locator, optionText: string) {
    const exactLabel = new RegExp(`^\\s*${escapeRegExp(optionText)}\\s*$`, 'i');

    await this.openSelectDropdown(dropdown);

    const searchInput = this.page.locator('input.p-select-filter:visible, input[role="searchbox"]:visible, input[placeholder*="Search"]:visible').first();
    if (await searchInput.isVisible({ timeout: 1500 }).catch(() => false)) {
      await searchInput.fill('');
      await searchInput.fill(optionText);
      await this.page.waitForTimeout(250);
    }

    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 15000 });

    const exactOption = listbox.locator('li[role="option"]')
      .filter({ hasText: exactLabel })
      .first();

    if (await exactOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await exactOption.click();
      return;
    }

    const visibleOptions = listbox.locator('li[role="option"]');
    const total = await visibleOptions.count();
    for (let index = 0; index < total; index++) {
      const option = visibleOptions.nth(index);
      const label = (await option.textContent()) || '';
      if (new RegExp(`^\\s*${escapeRegExp(optionText)}\\s*$`, 'i').test(label)) {
        await option.click();
        return;
      }
    }

    const firstVisibleOption = listbox.locator('li[role="option"]:visible').first();
    if (await firstVisibleOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstVisibleOption.click();
      return;
    }

    throw new Error(`Could not find option "${optionText}" in dropdown`);
  }

  private async chooseFirstAvailableOption(dropdown: Locator) {
    await this.openSelectDropdown(dropdown);
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 15000 });
    const firstOption = listbox.locator('li[role="option"]').first();
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    await firstOption.click();
  }

  private formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private getNextMonthDateFromToday() {
    const today = new Date();
    const year = today.getFullYear();
    const nextMonthIndex = today.getMonth() + 1;
    const lastDay = new Date(year, nextMonthIndex + 1, 0).getDate();
    const day = Math.min(today.getDate(), lastDay);
    return new Date(year, nextMonthIndex, day);
  }

  async selectClassAndSection(className: string, section: string) {
    await this.pickDropdownOption(this.classDropdown, className);
    await this.pickDropdownOption(this.sectionDropdown, section);
  }

  async selectAnySection() {
    await this.chooseFirstAvailableOption(this.sectionDropdown);
  }

  async selectStudent(studentName?: string) {
    const deadline = Date.now() + 30000;

    while (Date.now() < deadline) {
      try {
        const currentText = (await this.studentDropdown.locator('.p-select-label, [role="combobox"]').first().textContent().catch(() => '') || '').trim();
        if (currentText && !/^Select Student$/i.test(currentText) && !/^Select$/i.test(currentText)) {
          return;
        }

        if (studentName) {
          await this.pickDropdownOption(this.studentDropdown, studentName);
        } else {
          await this.chooseFirstAvailableOption(this.studentDropdown);
        }

        const selectedText = (await this.studentDropdown.locator('.p-select-label, [role="combobox"]').first().textContent().catch(() => '') || '').trim();
        if (selectedText && !/^Select Student$/i.test(selectedText) && !/^Select$/i.test(selectedText)) {
          return;
        }
      } catch {
        // retry until a valid student value is selected
      }

      await this.page.waitForTimeout(500);
    }

    throw new Error('Student dropdown was not selected with a valid value within the retry window.');
  }

  async selectBook(bookTitle: string) {
    const selectedChip = this.page.locator('.p-multiselect-chip-item', { hasText: bookTitle }).first();
    if (await selectedChip.isVisible({ timeout: 1500 }).catch(() => false)) {
      return;
    }

    const dropdownTrigger = this.bookIssueList.locator('.p-multiselect-dropdown').first();
    await this.bookIssueList.scrollIntoViewIfNeeded();
    await dropdownTrigger.waitFor({ state: 'visible', timeout: 15000 });
    await dropdownTrigger.click({ timeout: 15000 });
    await this.page.waitForTimeout(300);

    const bookCheckbox = this.page.locator(`input.p-checkbox-input[aria-label="${bookTitle}"]`).first();
    if (await bookCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      const checked = await bookCheckbox.isChecked().catch(() => false);
      if (!checked) {
        await bookCheckbox.check({ force: true });
      }
      await this.page.waitForTimeout(200);

      const blankArea = this.page.locator('body');
      await blankArea.click({ position: { x: 20, y: 20 } });
      await this.page.waitForTimeout(200);
      return;
    }

    const optionLabel = this.page.locator('li[role="option"], .p-multiselect-item').filter({ hasText: bookTitle }).first();
    if (await optionLabel.isVisible({ timeout: 5000 }).catch(() => false)) {
      await optionLabel.click();
      await this.page.waitForTimeout(200);

      const blankArea = this.page.locator('body');
      await blankArea.click({ position: { x: 20, y: 20 } });
      await this.page.waitForTimeout(200);
      return;
    }

    throw new Error(`Could not find book "${bookTitle}" in the book list`);
  }

  async fillDates(issueDate: Date = new Date(), dueDate: Date = this.getNextMonthDateFromToday()) {
    const issueDateButton = this.issueDateInput.locator('xpath=ancestor::p-datepicker[1]//button').first();
    const dueDateButton = this.dueDateInput.locator('xpath=ancestor::p-datepicker[1]//button').first();

    await issueDateButton.click();
    await this.page.waitForTimeout(300);

    const issueDay = String(issueDate.getDate()).padStart(2, '0');
    const issueCell = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month) span', { hasText: issueDay }).first();
    if (await issueCell.isVisible({ timeout: 5000 }).catch(() => false)) {
      await issueCell.click();
    }

    await this.page.waitForTimeout(300);
    await dueDateButton.click();
    await this.page.waitForTimeout(300);

    const dueDay = String(dueDate.getDate()).padStart(2, '0');
    const dueCell = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month) span', { hasText: dueDay }).first();
    if (await dueCell.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dueCell.click();
    }

    await this.page.waitForTimeout(200);
  }

  async setLibraryCardNumber(cardNumber?: string) {
    const value = cardNumber || 'STU-1001';
    await this.libraryCardNumberInput.fill(value);
  }

  async issueBook(details: BookIssueDetails) {
    await this.navigateToLibraryIssueForm();
    await this.selectBook(details.bookTitle);
    await this.selectClassAndSection(details.className, details.section);

    if (details.subject) {
      try {
        await this.pickDropdownOption(this.subjectDropdown, details.subject);
      } catch {
        await this.chooseFirstAvailableOption(this.subjectDropdown);
      }
    } else {
      await this.chooseFirstAvailableOption(this.subjectDropdown);
    }

    await this.selectStudent(details.studentName);
    await this.setLibraryCardNumber(details.libraryCardNumber);
    await this.fillDates(details.issueDate || new Date(), details.dueDate || this.getNextMonthDateFromToday());
    await this.remarksTextarea.fill(details.remarks || 'Issued for classroom reading and assignment submission.');

    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.submitButton.click();
    await this.page.waitForTimeout(1500);
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
