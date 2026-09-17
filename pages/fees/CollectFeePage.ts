import { Locator, Page, expect } from '@playwright/test';

export interface CollectFeeDetails {
  className: string;
  section: string;
  studentName: string;
  paymentMode: string;
  paymentDay: number;
}

export class CollectFeePage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly feesModuleCard: Locator;
  readonly collectFeesTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.feesModuleCard = page.locator('div.card:has(h3:text-is("Fees")), h3:text-is("Fees")').first();
    this.collectFeesTab = page.getByText('Collect fees', { exact: true }).first();
  }

  async navigateToCollectFees() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.feesModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.feesModuleCard.click();
    await this.collectFeesTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.collectFeesTab.click();
    await expect(this.page).toHaveURL(/fee-management/);
  }

  private async selectOption(dropdown: Locator, optionText: string) {
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await dropdown.click({ force: true });
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible, div[role="listbox"]:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 15000 });
    const option = listbox.getByRole('option', { name: optionText, exact: true }).first();
    const textOption = listbox.getByText(optionText, { exact: true }).first();
    const target = await option.count() ? option : textOption;
    await target.waitFor({ state: 'visible', timeout: 15000 });
    await target.click({ force: true });
  }

  private getFilterCombobox(label: string) {
    return this.page.getByRole('combobox', { name: label, exact: true }).first();
  }

  private async selectFilterOption(label: string, optionText: string) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const combobox = this.getFilterCombobox(label);
      await combobox.waitFor({ state: 'visible', timeout: 15000 });
      await combobox.click({ force: true });

      const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible, div[role="listbox"]:visible').last();
      await listbox.waitFor({ state: 'visible', timeout: 10000 });
      const option = listbox.getByRole('option', { name: optionText, exact: true }).last();
      if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
        await option.click({ force: true });
      } else {
        await combobox.press('ArrowDown');
        await combobox.press('Enter');
      }

      const selected = this.getFilterCombobox(label);
      if ((await selected.textContent()).trim().includes(optionText)) return;
      await this.page.keyboard.press('Escape').catch(() => undefined);
    }

    throw new Error(`Could not select ${optionText} from ${label}.`);
  }

  async searchStudent(details: Pick<CollectFeeDetails, 'className' | 'section' | 'studentName'>) {
    await this.selectFilterOption('Select class', details.className);
    await this.selectFilterOption('Select section', details.section);
    await this.selectFilterOption('Select student', details.studentName);
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
    await this.page.getByRole('button', { name: 'All', exact: true }).click();
  }

  async collectPayment(details: Pick<CollectFeeDetails, 'paymentMode' | 'paymentDay'>) {
    const checkbox = this.page.locator('.check-box').first();
    await checkbox.waitFor({ state: 'visible', timeout: 15000 });
    await checkbox.click();

    await this.selectOption(this.page.locator('p-select:visible').last(), details.paymentMode);
    const datePicker = this.page.locator('p-datepicker:visible').last();
    await datePicker.locator('button[aria-label="Choose Date"]').first().click();
    const calendar = this.page.locator('.p-datepicker-calendar:visible').last();
    const dateCell = calendar.locator('td:not(.p-datepicker-other-month) span').filter({ hasText: new RegExp(`^${details.paymentDay}$`) }).first();
    await dateCell.waitFor({ state: 'visible', timeout: 10000 });
    await dateCell.click();

    const collectButton = this.page.getByRole('button', { name: /Collect Payment ₹/ }).last();
    await expect(collectButton).toBeEnabled({ timeout: 15000 });
    await collectButton.click();
    const confirmDialog = this.page.getByRole('dialog').last();
    await confirmDialog.getByRole('button', { name: /Collect Payment ₹/ }).click();
  }

  async expectPaymentActionsVisible() {
    await expect(this.page.getByRole('button', { name: '🖨 Print' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: '📧 Email to Parent' })).toBeVisible();
  }

  async closePaymentReceipt() {
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }
}
