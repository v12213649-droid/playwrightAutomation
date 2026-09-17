import { expect, Locator, Page } from '@playwright/test';

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday';

export interface AttendanceDetails {
  className: string;
  section: string;
  attendanceDate: Date;
  studentName: string;
  status: AttendanceStatus;
}

export interface StudentHistoryDetails {
  className: string;
  section: string;
  studentName: string;
}

export interface ClassReportDetails {
  className: string;
  section: string;
  fromDate: Date;
  toDate: Date;
}

export class AddAttendancePage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly attendanceCard: Locator;
  readonly markAttendanceTab: Locator;
  readonly classDropdown: Locator;
  readonly sectionDropdown: Locator;
  readonly datePicker: Locator;
  readonly loadStudentsButton: Locator;
  readonly saveAttendanceButton: Locator;
  readonly markAllPresentButton: Locator;
  readonly markAllAbsentButton: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.attendanceCard = page.locator('div.card:has(h3:text-is("Attendance")), h3:text-is("Attendance")').first();
    this.markAttendanceTab = page.getByText('Mark Attendance', { exact: true }).first();

    this.classDropdown = page.locator('.filter-card .field').filter({ has: page.locator('label', { hasText: /^Class$/ }) }).locator('p-select').first();
    this.sectionDropdown = page.locator('.filter-card .field').filter({ has: page.locator('label', { hasText: /^Section$/ }) }).locator('p-select').first();
    this.datePicker = page.locator('.filter-card .field').filter({ has: page.locator('label', { hasText: /^Date$/ }) }).locator('p-datepicker').first();
    this.loadStudentsButton = page.locator('button.load-student-btn').filter({ hasText: 'Load Students' }).first();
    this.saveAttendanceButton = page.locator('button.add-btn').filter({ hasText: /^\s*Save Attendance\s*$/ }).first();
    this.markAllPresentButton = page.locator('button.btn-mark-present').filter({ hasText: 'Mark All Present' }).first();
    this.markAllAbsentButton = page.locator('button.btn-mark-absent').filter({ hasText: 'Mark All Absent' }).first();
    this.clearButton = page.locator('button.outline-btn').filter({ hasText: /^\s*Clear\s*$/ }).first();
  }

  async navigateToMarkAttendance() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.attendanceCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.attendanceCard.click();
    await this.page.waitForTimeout(700);

    await this.markAttendanceTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.markAttendanceTab.click({ force: true });
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
    await this.page.waitForTimeout(200);
    await option.click();
  }

  private async selectDate(date: Date) {
    const input = this.datePicker.locator('input').first();
    const calendarButton = this.datePicker.locator('button[aria-label="Choose Date"]').first();
    await calendarButton.click();
    await this.page.waitForTimeout(300);

    const day = String(date.getDate());
    const todayCell = this.page.locator('.p-datepicker-calendar td.p-datepicker-today span').first();
    const dateCell = this.page.locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}")`).first();
    const cell = await todayCell.isVisible({ timeout: 2000 }).catch(() => false) ? todayCell : dateCell;
    await cell.waitFor({ state: 'visible', timeout: 10000 });
    await cell.click();

    await expect(input).not.toHaveValue('');
  }

  async loadStudents(details: AttendanceDetails) {
    await this.selectDropdownOption(this.classDropdown, details.className);
    await this.selectDropdownOption(this.sectionDropdown, details.section);
    await this.selectDate(details.attendanceDate);
    await this.loadStudentsButton.scrollIntoViewIfNeeded();
    await this.loadStudentsButton.click();
    await this.page.waitForTimeout(1000);
  }

  async markStudentAttendance(studentName: string, status: AttendanceStatus) {
    const studentRow = this.page.locator('tr').filter({
      has: this.page.getByText(studentName, { exact: true }),
    }).first();
    await studentRow.waitFor({ state: 'visible', timeout: 20000 });

    const statusButtonClass: Record<AttendanceStatus, string> = {
      Present: 'btn-present',
      Absent: 'btn-absent',
      Leave: 'btn-leave',
      Holiday: 'btn-holiday',
    };

    const statusButton = studentRow.locator(`button.${statusButtonClass[status]}`).first();
    await statusButton.waitFor({ state: 'visible', timeout: 10000 });
    await statusButton.click();
    await expect(statusButton).toHaveClass(new RegExp(`\\b${statusButtonClass[status]}\\b`));
  }

  async saveAttendance() {
    await this.saveAttendanceButton.scrollIntoViewIfNeeded();
    await this.saveAttendanceButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.saveAttendanceButton.click({ timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async markAllPresent() {
    await this.markAllPresentButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.markAllPresentButton.click();
  }

  async markAllAbsent() {
    await this.markAllAbsentButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.markAllAbsentButton.click();
  }

  async clearAttendanceFilters() {
    await this.clearButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.clearButton.click();
  }

  async markAttendance(details: AttendanceDetails) {
    await this.navigateToMarkAttendance();
    await this.loadStudents(details);
    await this.markStudentAttendance(details.studentName, details.status);
    await this.saveAttendance();
  }

  private async clickAttendanceTab(tabName: string) {
    const tab = this.page.getByText(tabName, { exact: true }).first();
    await tab.waitFor({ state: 'visible', timeout: 20000 });
    await tab.click({ force: true });
    await this.page.waitForTimeout(700);
  }

  private fieldSelect(labelText: string) {
    return this.page.locator('label').filter({ hasText: new RegExp(`^\\s*${labelText}\\s*$`, 'i') })
      .locator('xpath=..').locator('p-select:visible').first();
  }

  private visibleDatePickers() {
    return this.page.locator('p-datepicker:visible');
  }

  private async selectDateFromPicker(picker: Locator, date: Date) {
    const input = picker.locator('input').first();
    await picker.locator('button[aria-label="Choose Date"]').first().click();
    await this.page.waitForTimeout(300);

    const day = String(date.getDate());
    const todayCell = this.page.locator('.p-datepicker-calendar td.p-datepicker-today span').first();
    const dateCell = this.page.locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}")`).first();
    const cell = await todayCell.isVisible({ timeout: 2000 }).catch(() => false) ? todayCell : dateCell;
    await cell.scrollIntoViewIfNeeded();
    await cell.click();
    await expect(input).not.toHaveValue('');
  }

  async viewStudentHistory(details: StudentHistoryDetails) {
    await this.navigateToMarkAttendance();
    await this.clickAttendanceTab('Student History');
    await this.selectDropdownOption(this.fieldSelect('Class'), details.className);
    await this.selectDropdownOption(this.fieldSelect('Section'), details.section);
    await this.selectDropdownOption(this.fieldSelect('Student'), details.studentName);

    const viewHistoryButton = this.page.getByRole('button', { name: 'View History', exact: true });
    await viewHistoryButton.waitFor({ state: 'visible', timeout: 15000 });
    await viewHistoryButton.click();
    await this.page.waitForTimeout(1000);
  }

  async showClassReport(details: ClassReportDetails) {
    await this.navigateToMarkAttendance();
    await this.clickAttendanceTab('Class Report');
    await this.selectDropdownOption(this.fieldSelect('Class'), details.className);
    await this.selectDropdownOption(this.fieldSelect('Section'), details.section);

    const datePickers = this.visibleDatePickers();
    await datePickers.nth(0).waitFor({ state: 'visible', timeout: 10000 });
    await this.selectDateFromPicker(datePickers.nth(0), details.fromDate);
    await this.selectDateFromPicker(datePickers.nth(1), details.toDate);

    const showButton = this.page.getByRole('button', { name: 'Show', exact: true });
    await showButton.waitFor({ state: 'visible', timeout: 15000 });
    await showButton.click();
    await this.page.waitForTimeout(1000);
  }

  async viewDailyAttendance(date: Date) {
    await this.navigateToMarkAttendance();
    await this.clickAttendanceTab('Daily View');
    const dailyDatePicker = this.visibleDatePickers().first();
    await dailyDatePicker.waitFor({ state: 'visible', timeout: 10000 });
    await this.selectDateFromPicker(dailyDatePicker, date);

    const viewButton = this.page.getByRole('button', { name: 'View', exact: true });
    await viewButton.waitFor({ state: 'visible', timeout: 15000 });
    await viewButton.click();
    await this.page.waitForTimeout(1000);
  }
}
