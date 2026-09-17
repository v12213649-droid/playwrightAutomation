import { Locator, Page, expect } from '@playwright/test';

export const FEE_TYPE = {
  ACADEMIC: 'Academic',
  TRANSPORT: 'Transport',
  OTHER: 'Other',
} as const;

export const FEE_DURATION = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUALLY: 'Annually',
  ONE_TIME: 'One Time',
  HALF_YEARLY: 'Half Yearly',
} as const;

export const FEE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;

export interface FeeStructureItem {
  className: string;
  feeType: string;
  amount: number;
  lateFeePerDay: number;
  gracePeriodDays: number;
}

export interface FeeStructureUpdate {
  className?: string;
  feeType?: string;
  amount?: number;
  lateFeePerDay?: number;
  gracePeriodDays?: number;
}

export interface FeeTypeDetails {
  feeType: string;
  customName?: string;
  duration: string;
  description?: string;
  status?: string;
}

export class FeeModule {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly feesModuleCard: Locator;
  readonly feeStructureTab: Locator;
  readonly feeTypesTab: Locator;
  readonly addFeeStructureButton: Locator;
  readonly addFeeTypeButton: Locator;
  readonly feeTypeSelect: Locator;
  readonly durationSelect: Locator;
  readonly descriptionInput: Locator;
  readonly addButton: Locator;
  readonly customNameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.feesModuleCard = page.locator('div.card:has(h3:text-is("Fees"))').first();
    this.feeStructureTab = page.locator('[routerlink="/school-management/fee-management/fee-structure"]').first();
    this.feeTypesTab = page.locator('[routerlink="/school-management/fee-management/fee-type"]').first();
    this.addFeeStructureButton = page.getByRole('button', { name: 'Add Fee Structure', exact: true }).first();
    this.addFeeTypeButton = page.getByRole('button', { name: 'Add Fee Type', exact: true }).first();
    this.feeTypeSelect = page.locator('p-select[formcontrolname="name"]').first();
    this.durationSelect = page.locator('p-select[formcontrolname="frequency"]').first();
    this.descriptionInput = page.locator('textarea[formcontrolname="description"]').first();
    this.addButton = page.locator('button.add-btn-sm').filter({ hasText: /^\s*Add\s*$/ }).first();
    this.customNameInput = page.locator('input[formcontrolname="customName"]').first();
  }

  async navigateToFeeStructure() {
    await this.navigateToFees();
    await this.feeStructureTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.feeStructureTab.click();
  }

  async navigateToFeeTypes() {
    await this.navigateToFees();
    await this.feeTypesTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.feeTypesTab.click();
  }

  private async navigateToFees() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.feesModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.feesModuleCard.click();
  }

  private async openDropdown(dropdown: Locator) {
    const trigger = dropdown.locator('button[aria-label="dropdown trigger"], [role="combobox"], .p-select-dropdown, .p-select-trigger, button[aria-haspopup="listbox"]').first();

    await trigger.waitFor({ state: 'visible', timeout: 15000 });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click({ force: true });
    await this.page.waitForTimeout(400);

    const listbox = this.page
      .locator('ul[role="listbox"], .p-select-list, div[role="listbox"], .p-dropdown-panel')
      .filter({ has: this.page.locator('[role="option"], li, .p-select-item, .p-dropdown-item') })
      .first();

    await listbox.waitFor({ state: 'visible', timeout: 15000 });
    return listbox;
  }

  private async selectDropdownOption(dropdown: Locator, optionText: string) {
    const listbox = await this.openDropdown(dropdown);
    const option = listbox.locator('[role="option"], li, .p-select-item, .p-dropdown-item').filter({ hasText: optionText }).first();
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click({ force: true });
  }

  private async selectAnyDropdownOption(dropdown: Locator): Promise<string> {
    const listbox = await this.openDropdown(dropdown);
    const options = listbox.locator('[role="option"], li, .p-select-item, .p-dropdown-item');
    const count = await options.count();

    if (!count) {
      throw new Error('No dropdown options available to select.');
    }

    const option = options.nth(Math.floor(Math.random() * count));
    const optionText = (await option.textContent())?.trim() ?? '';
    await option.click({ force: true });
    return optionText;
  }

  private async chooseOption(dropdown: Locator, optionText: string) {
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 10000 });
    const option = listbox.getByRole('option', { name: optionText, exact: true }).first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async addFeeStructure(item: FeeStructureItem): Promise<string> {
    await this.addFeeStructureButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addFeeStructureButton.click({ force: true });

    const dialog = this.page.getByRole('dialog', { name: /Add Fee Structure/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 20000 });
    const form = dialog.locator('form').last();
    await form.waitFor({ state: 'visible', timeout: 20000 });

    await this.selectDropdownOption(form.locator('p-select[formcontrolname="classId"]').first(), item.className);
    const selectedFeeType = await this.selectAnyDropdownOption(form.locator('p-select[formcontrolname="type"]').first());
    item.feeType = selectedFeeType;
    await form.locator('input[formcontrolname="amount"]').fill(String(item.amount));
    await form.locator('input[formcontrolname="lateFeePerDay"]').fill(String(item.lateFeePerDay));
    await form.locator('input[formcontrolname="gracePeriodDays"]').fill(String(item.gracePeriodDays));
    await dialog.getByRole('button', { name: /^Add$/ }).first().click({ force: true });

    return selectedFeeType;
  }

  async editFirstFeeStructure(className: string, updated: FeeStructureUpdate) {
    const summaryRow = this.page.locator('tr').filter({
      has: this.page.getByText(new RegExp(`Class\\s*${this.escapeRegExp(className)}`), { exact: false }),
    }).first();

    await summaryRow.waitFor({ state: 'visible', timeout: 20000 });
    await summaryRow.locator('button:has(.pi-chevron-right), button:has(.pi-chevron-down)').first().click();
    const detailRow = summaryRow.locator('xpath=following-sibling::tr[1]');
    await detailRow.waitFor({ state: 'visible', timeout: 10000 });
    await detailRow.locator('button:has(.pi-pencil), img[src*="edit.svg"]').first().click();

    const form = this.page.locator('form').last();
    await form.waitFor({ state: 'visible', timeout: 20000 });
    if (updated.className) await this.selectDropdownOption(form.locator('p-select[formcontrolname="classId"]'), updated.className);
    if (updated.feeType) {
      try { await this.selectDropdownOption(form.locator('p-select[formcontrolname="type"]'), updated.feeType); } catch { }
    }
    if (updated.amount !== undefined) await form.locator('input[formcontrolname="amount"]').fill(String(updated.amount));
    if (updated.lateFeePerDay !== undefined) await form.locator('input[formcontrolname="lateFeePerDay"]').fill(String(updated.lateFeePerDay));
    if (updated.gracePeriodDays !== undefined) await form.locator('input[formcontrolname="gracePeriodDays"]').fill(String(updated.gracePeriodDays));

    const datePickers = form.locator('p-datepicker');
    await this.selectTodayFromDatePicker(datePickers.nth(0));
    await this.selectTodayFromDatePicker(datePickers.nth(1));
    await this.page.getByRole('button', { name: 'Update', exact: true }).last().click({ force: true });
  }

  async deleteFirstFeeStructure(className: string): Promise<string> {
    const summaryRow = this.page.locator('tr').filter({
      has: this.page.locator('td').filter({
        hasText: new RegExp(`^Class\\s*${this.escapeRegExp(className)}$`),
      }),
    }).first();

    await summaryRow.waitFor({ state: 'visible', timeout: 20000 });
    await summaryRow.locator('button:has(.pi-chevron-right), button:has(.pi-chevron-down)').first().click();
    const detailRow = summaryRow.locator('xpath=following-sibling::tr[1]');
    await detailRow.waitFor({ state: 'visible', timeout: 10000 });
    const feeType = (await detailRow.locator('td').nth(1).textContent())?.trim() ?? '';
    await detailRow.locator('button:has(.pi-trash), img[src*="trash.svg"]').first().click();
    await this.confirmRemoval();
    return feeType;
  }

  async addFeeType(details: FeeTypeDetails) {
    await this.addFeeTypeButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addFeeTypeButton.click();
    await this.chooseOption(this.feeTypeSelect, details.feeType);
    await this.customNameInput.fill(details.customName ?? details.feeType);
    await this.chooseOption(this.durationSelect, details.duration);
    if (details.description) await this.descriptionInput.fill(details.description);
    await this.addButton.click();
  }

  async editFeeType(currentName: string, updated: FeeTypeDetails) {
    const row = this.page.locator('tr').filter({ has: this.page.getByText(currentName, { exact: true }) }).first();
    await row.waitFor({ state: 'visible', timeout: 20000 });
    await row.locator('i.pi-pencil.cursor').click();

    const dialog = this.page.getByRole('dialog').last();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await this.chooseOption(dialog.locator('p-select[formcontrolname="name"]'), FEE_TYPE.OTHER);
    await dialog.locator('input[formcontrolname="customName"]').fill(updated.customName ?? updated.feeType);
    await this.chooseOption(dialog.locator('p-select[formcontrolname="frequency"]'), updated.duration);
    if (updated.description) await dialog.locator('textarea[formcontrolname="description"]').fill(updated.description);
    if (updated.status) await this.chooseOption(dialog.locator('p-select[formcontrolname="status"]'), updated.status);
    await dialog.locator('button.add-btn-sm').filter({ hasText: /^\s*Update\s*$/ }).click();
  }

  async deleteFeeType(name?: string) {
    const rows = this.page.locator('tbody tr');
    const row = name
      ? rows.filter({ has: this.page.getByText(name, { exact: true }) }).first()
      : rows.filter({ has: this.page.locator('i.pi-trash.cursor') }).first();

    await row.waitFor({ state: 'visible', timeout: 20000 });
    const feeTypeName = (await row.locator('td').first().textContent())?.trim() ?? '';
    await row.locator('i.pi-trash.cursor').click();
    await this.confirmRemoval();
    return feeTypeName;
  }

  async expectFeeStructureVisible(className: string) {
    const row = this.page.locator('tr').filter({ has: this.page.getByText(new RegExp(`Class\\s*${this.escapeRegExp(className)}`), { exact: false }) }).first();
    await expect(row).toBeVisible();
  }

  async expectFeeStructureHidden(feeType: string) {
    await expect(this.page.locator('tr').filter({ has: this.page.getByText(feeType, { exact: true }) }).first()).toHaveCount(0);
  }

  async expectFeeTypeVisible(name: string) {
    await expect(this.page.locator('tr').filter({ has: this.page.getByText(name, { exact: true }) }).first()).toBeVisible();
  }

  async expectFeeTypeHidden(name: string) {
    await expect(this.page.locator('tr').filter({ has: this.page.getByText(name, { exact: true }) }).first()).toHaveCount(0);
  }

  private async selectTodayFromDatePicker(datePicker: Locator) {
    await datePicker.locator('button[aria-label="Choose Date"]').first().click({ force: true });
    await this.page.locator('.p-datepicker-calendar:visible td.p-datepicker-today span').first().click({ force: true });
  }

  private async confirmRemoval() {
    const confirmDialog = this.page.getByRole('alertdialog').last();
    await confirmDialog.locator('button.p-confirmdialog-accept-button').filter({ hasText: 'Yes, Remove' }).first().click();
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
