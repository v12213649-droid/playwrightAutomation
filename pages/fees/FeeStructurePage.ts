import { Locator, Page, expect } from '@playwright/test';

export interface FeeStructureItem {
  className: string;
  feeType: string;
  amount: number;
  lateFeePerDay: number;
  gracePeriodDays: number;
}

export interface FeeStructureUpdate {
  currentFeeType?: string;
  className?: string;
  feeType?: string;
  amount?: number;
  lateFeePerDay?: number;
  gracePeriodDays?: number;
  startDateDay?: number;
  endDateDay?: number;
  endDateNextMonth?: boolean;
}

export class FeeStructurePage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly feesModuleCard: Locator;
  readonly feeStructureTab: Locator;
  readonly addFeeStructureButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.feesModuleCard = page.locator('div.card:has(h3:text-is("Fees")), h3:text-is("Fees")').first();
    this.feeStructureTab = page.locator('[routerlink="/school-management/fee-management/fee-structure"]').first();
    this.addFeeStructureButton = page.getByRole('button', { name: 'Add Fee Structure', exact: true }).first();
  }

  async navigateToFeeStructure() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.feesModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.feesModuleCard.click();
    await this.feeStructureTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.feeStructureTab.click();
  }

  private async openDropdown(dropdown: Locator) {
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await dropdown.scrollIntoViewIfNeeded();
    const trigger = dropdown.locator('[role="combobox"], button[aria-label="dropdown trigger"], .p-select-dropdown, .p-select-trigger').first();
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click({ force: true });
    } else {
      await dropdown.click({ force: true });
    }
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible, div[role="listbox"]:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 15000 });
    return listbox;
  }

  private async selectOption(dropdown: Locator, optionText: string) {
    const listbox = await this.openDropdown(dropdown);
    const option = listbox.getByRole('option', { name: optionText, exact: true }).first();
    const textOption = listbox.getByText(optionText, { exact: true }).first();
    const target = await option.count() ? option : textOption;
    await target.waitFor({ state: 'visible', timeout: 15000 });
    await target.click({ force: true });
  }

  async addFee(item: FeeStructureItem): Promise<string> {
    await this.addFeeStructureButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addFeeStructureButton.click();

    const dialog = this.page.getByRole('dialog', { name: /Add Fee Structure/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 20000 });
    const form = dialog.locator('form').last();
    await form.waitFor({ state: 'visible', timeout: 20000 });

    await this.selectOption(form.locator('p-select[formcontrolname="classId"]').first(), item.className);
    await this.selectOption(form.locator('p-select[formcontrolname="type"]').first(), item.feeType);
    await form.locator('input[formcontrolname="amount"]').fill(String(item.amount));
    await form.locator('input[formcontrolname="lateFeePerDay"]').fill(String(item.lateFeePerDay));
    await form.locator('input[formcontrolname="gracePeriodDays"]').fill(String(item.gracePeriodDays));
    await dialog.getByRole('button', { name: 'Add', exact: true }).click();
    return item.feeType;
  }

  async editFee(className: string, updated: FeeStructureUpdate) {
    const summaryRow = this.page.locator('tr').filter({
      has: this.page.getByText(new RegExp(`Class\\s*${this.escapeRegExp(className)}`), { exact: false }),
    }).first();
    await summaryRow.waitFor({ state: 'visible', timeout: 20000 });
    await summaryRow.locator('button:has(.pi-chevron-right), button:has(.pi-chevron-down)').first().click();

    const detailRows = summaryRow.locator('xpath=following-sibling::tr');
    const detailRow = updated.currentFeeType
      ? detailRows.filter({ has: this.page.getByText(updated.currentFeeType, { exact: true }) }).first()
      : detailRows.first();
    await detailRow.waitFor({ state: 'visible', timeout: 10000 });
    await detailRow.locator('button:has(.pi-pencil), img[src*="edit.svg"]').first().click();

    const form = this.page.locator('form').last();
    await form.waitFor({ state: 'visible', timeout: 20000 });
    if (updated.className) await this.selectOption(form.locator('p-select[formcontrolname="classId"]'), updated.className);
    if (updated.feeType) {
      await this.selectOption(form.locator('p-select[formcontrolname="type"]'), updated.feeType);
    }
    if (updated.amount !== undefined) await form.locator('input[formcontrolname="amount"]').fill(String(updated.amount));
    if (updated.lateFeePerDay !== undefined) await form.locator('input[formcontrolname="lateFeePerDay"]').fill(String(updated.lateFeePerDay));
    if (updated.gracePeriodDays !== undefined) await form.locator('input[formcontrolname="gracePeriodDays"]').fill(String(updated.gracePeriodDays));

    const datePickers = form.locator('p-datepicker');
    await this.selectDateFromPicker(datePickers.nth(0), updated.startDateDay);
    await this.selectDateFromPicker(datePickers.nth(1), updated.endDateDay, updated.endDateNextMonth);
    await this.page.getByRole('button', { name: 'Update', exact: true }).last().click();
  }

  async deleteFee(className: string, feeType?: string): Promise<string> {
    const summaryRow = this.page.locator('tr').filter({
      has: this.page.getByText(new RegExp(`Class\\s*${this.escapeRegExp(className)}`), { exact: false }),
    }).first();
    await summaryRow.waitFor({ state: 'visible', timeout: 20000 });
    await summaryRow.locator('button:has(.pi-chevron-right), button:has(.pi-chevron-down)').first().click();

    const detailRows = summaryRow.locator('xpath=following-sibling::tr');
    const detailRow = feeType
      ? detailRows.filter({ has: this.page.getByText(feeType, { exact: true }) }).first()
      : detailRows.first();
    await detailRow.waitFor({ state: 'visible', timeout: 10000 });
    const feeRow = feeType
      ? detailRow.locator('table tbody tr').filter({ has: this.page.getByText(feeType, { exact: true }) }).first()
      : detailRow.locator('table tbody tr').first();
    await feeRow.waitFor({ state: 'visible', timeout: 10000 });
    const deletedFeeType = (await feeRow.locator('td').first().textContent())?.trim() ?? '';
    const deleteAction = feeRow.locator('button:has(.pi-trash), img[src*="trash"]').first();
    if (await deleteAction.count()) {
      await deleteAction.click();
    } else {
      await feeRow.locator('td').last().locator('img').nth(1).click();
    }
    await this.confirmRemoval();
    return deletedFeeType;
  }

  async expectFeeVisible(className: string) {
    const row = this.page.locator('tr').filter({
      has: this.page.getByText(new RegExp(`Class\\s*${this.escapeRegExp(className)}`), { exact: false }),
    }).first();
    await expect(row).toBeVisible();
  }

  async expectFeeHidden(feeType: string) {
    await expect(this.page.locator('tr').filter({ has: this.page.getByText(feeType, { exact: true }) }).first()).toHaveCount(0);
  }

  private async selectDateFromPicker(datePicker: Locator, day = new Date().getDate(), nextMonth = false) {
    await datePicker.locator('button[aria-label="Choose Date"]').first().click({ force: true });
    if (nextMonth) {
      const activeDateDialog = this.page.getByRole('dialog', { name: 'Choose Date' }).last();
      await activeDateDialog.getByRole('button', { name: 'Next Month', exact: true }).click();
    }
    const calendar = this.page.locator('.p-datepicker-calendar:visible').last();
    const dateCell = calendar.locator('td:not(.p-datepicker-other-month) span').filter({ hasText: new RegExp(`^${day}$`) }).first();
    await dateCell.waitFor({ state: 'visible', timeout: 10000 });
    await dateCell.click();
  }

  private async confirmRemoval() {
    const confirmDialog = this.page.getByRole('alertdialog').last();
    await confirmDialog.getByRole('button', { name: 'Yes, Remove', exact: true }).click();
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
