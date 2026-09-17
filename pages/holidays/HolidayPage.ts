import { Locator, Page, expect } from '@playwright/test';

export interface HolidayDetails {
  name: string;
  date: string;
  type: string;
  applicableTo: string[];
  description?: string;
}

export class HolidayPage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly holidayModuleCard: Locator;
  readonly addHolidayButton: Locator;
  readonly holidayNameInput: Locator;
  readonly startDateInput: Locator;
  readonly holidayTypeDropdown: Locator;
  readonly applicableToDropdown: Locator;
  readonly descriptionTextarea: Locator;
  readonly addButton: Locator;
  readonly listToggleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.holidayModuleCard = page.locator('div.card:has(h3:text-is("Holiday Calendar"))').first();
    this.addHolidayButton = page.getByRole('button', { name: 'Add Holiday', exact: true });
    this.holidayNameInput = page.locator('input[formcontrolname="name"]');
    this.startDateInput = page.locator('p-datepicker[formcontrolname="startDate"] input');
    this.holidayTypeDropdown = page.locator('p-select[formcontrolname="type"]');
    this.applicableToDropdown = page.locator('p-multiselect[formcontrolname="applicableTo"]');
    this.descriptionTextarea = page.locator('textarea[formcontrolname="description"]');
    this.addButton = page.getByRole('button', { name: /^Add$/ });
    this.listToggleButton = page.getByRole('button', { name: /List/ }).first();
  }

  async navigateToHolidayCalendar() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.holidayModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.holidayModuleCard.click();
  }

  async openAddHoliday() {
    await this.addHolidayButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addHolidayButton.click();
    await this.holidayNameInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  private async selectOption(dropdown: Locator, value: string) {
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    const option = listbox.locator('[role="option"]').filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(value)}\\s*$`, 'i') }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  private async selectApplicableTo(values: string[]) {
    await this.applicableToDropdown.scrollIntoViewIfNeeded();
    await this.applicableToDropdown.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible').last();
    for (const value of values) {
      const option = listbox.locator('[role="option"]').filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(value)}\\s*$`, 'i') }).first();
      await option.waitFor({ state: 'visible', timeout: 5000 });
      if ((await option.getAttribute('aria-selected')) !== 'true') {
        await option.click();
      }
    }
    await this.page.keyboard.press('Escape');
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async selectDate(input: Locator, dateValue: string) {
    const [dayText, monthText, yearText] = dateValue.split('/');
    const day = Number(dayText);
    const month = Number(monthText) - 1;
    const year = Number(yearText);

    await input.scrollIntoViewIfNeeded();
    await input.locator('xpath=ancestor::p-datepicker[1]').locator('button[aria-label="Choose Date"]').click();
    await this.page.waitForTimeout(300);

    const chooseYearButton = this.page.locator('button[aria-label="Choose Year"]:visible').first();
    if (await chooseYearButton.isVisible({ timeout: 1500 }).catch(() => false)) {
      await chooseYearButton.click();
      await this.page.waitForTimeout(200);
      const targetYear = this.page.locator(`span.p-datepicker-year:visible:text-is("${year}")`).first();
      await targetYear.waitFor({ state: 'visible', timeout: 5000 });
      await targetYear.click();
      await this.page.waitForTimeout(200);

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const targetMonth = this.page.locator(`span.p-datepicker-month:visible:text-is("${monthNames[month]}")`).first();
      await targetMonth.waitFor({ state: 'visible', timeout: 5000 });
      await targetMonth.click();
      await this.page.waitForTimeout(200);
    } else {
      const nextMonthButton = this.page
        .locator('.p-datepicker-next-button:visible, button[aria-label="Next Month"]:visible, button[data-pc-section="nextbutton"]:visible')
        .first();
      if (await nextMonthButton.isVisible({ timeout: 1500 }).catch(() => false)) {
        await nextMonthButton.click();
        await this.page.waitForTimeout(200);
      }
    }

    const dateCell = this.page
      .locator(`span[data-date="${year}-${month}-${day}"]:visible, .p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}"):visible`)
      .first();
    await dateCell.waitFor({ state: 'visible', timeout: 5000 });
    await dateCell.click();

    if ((await input.inputValue()).trim() !== dateValue) {
      await input.fill(dateValue);
      await input.dispatchEvent('input');
      await input.dispatchEvent('change');
      await input.press('Tab');
    }
    await expect(input).toHaveValue(dateValue);
  }

  async fillHoliday(details: HolidayDetails) {
    await this.holidayNameInput.scrollIntoViewIfNeeded();
    await this.holidayNameInput.fill(details.name);
    await this.selectDate(this.startDateInput, details.date);
    await this.selectOption(this.holidayTypeDropdown, details.type);
    await this.selectApplicableTo(details.applicableTo);
    if (details.description) {
      await this.descriptionTextarea.fill(details.description);
    }
  }

  async addHoliday() {
    await this.page.keyboard.press('Escape');
    const dialog = this.page.getByRole('dialog').last();
    const addButton = dialog.locator('button.add-btn').filter({ hasText: /^\s*Add\s*$/ }).first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // In this module the dialog can remain visible while the list refreshes,
    // so the actual verification happens after the holiday is listed.
    await Promise.race([
      dialog.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined),
      this.page.waitForTimeout(1500),
    ]);
  }

  async openList() {
    if (await this.listToggleButton.isVisible().catch(() => false)) {
      await this.listToggleButton.click();
    }
  }

  private holidayRow(name: string) {
    return this.page
      .locator('tr, .holiday-card, .holiday-item, .holiday-row, .card')
      .filter({ hasText: name })
      .filter({ has: this.page.locator('button[ptooltip="Edit"], button[ptooltip="Remove"]') })
      .first();
  }

  async editHoliday(currentName: string, updated: HolidayDetails) {
    const row = this.holidayRow(currentName);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.locator('button[ptooltip="Edit"]').click();
    const dialog = this.page.getByRole('dialog').last();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await dialog.locator('input[formcontrolname="name"]').fill(updated.name);
    await this.selectDate(dialog.locator('p-datepicker[formcontrolname="startDate"] input'), updated.date);
    await dialog.locator('textarea[formcontrolname="description"]').fill(updated.description ?? '');
    await dialog.getByRole('button', { name: /Save Changes/ }).click();
  }

  async deleteHoliday(name: string) {
    const row = this.holidayRow(name);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.locator('button[ptooltip="Remove"]').click();

    const dialog = this.page.getByRole('alertdialog').last();
    if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      const confirmButton = dialog.locator('button.p-confirmdialog-accept-button').filter({ hasText: 'Yes, Remove' }).first();
      await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
      await confirmButton.click();
    }

    await expect.poll(async () => await this.holidayRow(name).count(), { timeout: 20000 }).toBe(0);
  }

  async expectNoValidationErrors() {
    await expect(this.page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
  }

  async expectHolidayVisible(name: string) {
    await expect(this.holidayRow(name)).toBeVisible();
  }

  async expectHolidayHidden(name: string) {
    await expect.poll(async () => await this.holidayRow(name).count(), { timeout: 20000 }).toBe(0);
  }
}
