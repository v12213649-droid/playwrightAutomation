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
  readonly feeTypesTab: Locator;
  readonly addFeeTypeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.feesModuleCard = page.locator('div.card:has(h3:text-is("Fees")), h3:text-is("Fees")').first();
    this.feeTypesTab = page.locator('[routerlink="/school-management/fee-management/fee-type"]').first();
    this.addFeeTypeButton = page.getByRole('button', { name: 'Add Fee Type', exact: true }).first();
  }

  async navigateToFeeTypes() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.feesModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.feesModuleCard.click();
    await this.feeTypesTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.feeTypesTab.click();
  }

  private async chooseOption(dropdown: Locator, optionText: string) {
    const trigger = dropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 10000 });
    const option = listbox.getByRole('option', { name: optionText, exact: true }).first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async addFeeType(details: FeeTypeDetails) {
    await this.addFeeTypeButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addFeeTypeButton.click();
    const dialog = this.page.getByRole('dialog', { name: /Add Fee Type/i }).last();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.chooseOption(dialog.locator('p-select[formcontrolname="name"]'), details.feeType);
    await dialog.locator('input[formcontrolname="customName"]').fill(details.customName ?? details.feeType);
    await this.chooseOption(dialog.locator('p-select[formcontrolname="frequency"]'), details.duration);
    if (details.description) await dialog.locator('textarea[formcontrolname="description"]').fill(details.description);
    await dialog.getByRole('button', { name: 'Add', exact: true }).click();
  }

  async editFeeType(currentName: string, updated: FeeTypeDetails) {
    const row = this.page.locator('tbody tr').filter({ has: this.page.getByText(currentName, { exact: true }) }).first();
    await row.waitFor({ state: 'visible', timeout: 20000 });
    await row.locator('i.pi-pencil.cursor, button:has(i.pi-pencil), img[src*="edit"]').first().click();
    const dialog = this.page.getByRole('dialog', { name: /Edit Fee Type/i }).last();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await this.chooseOption(dialog.locator('p-select[formcontrolname="name"]'), updated.feeType);
    await dialog.locator('input[formcontrolname="customName"]').fill(updated.customName ?? updated.feeType);
    await this.chooseOption(dialog.locator('p-select[formcontrolname="frequency"]'), updated.duration);
    if (updated.description) await dialog.locator('textarea[formcontrolname="description"]').fill(updated.description);
    if (updated.status) await this.chooseOption(dialog.locator('p-select[formcontrolname="status"]'), updated.status);
    await dialog.getByRole('button', { name: 'Update', exact: true }).click();
  }

  async deleteFeeType(name: string) {
    const row = this.page.locator('tbody tr').filter({ has: this.page.getByText(name, { exact: true }) }).first();
    await row.waitFor({ state: 'visible', timeout: 20000 });
    await row.locator('i.pi-trash.cursor, button:has(i.pi-trash), img[src*="trash"]').first().click();
    const confirmDialog = this.page.getByRole('alertdialog').last();
    await confirmDialog.getByRole('button', { name: 'Yes, Remove', exact: true }).click();
    return name;
  }

  async expectFeeTypeVisible(name: string) {
    await expect(this.page.locator('tbody tr').filter({ has: this.page.getByText(name, { exact: true }) }).first()).toBeVisible();
  }

  async expectFeeTypeHidden(name: string) {
    await expect(this.page.locator('tbody tr').filter({ has: this.page.getByText(name, { exact: true }) })).toHaveCount(0);
  }
}
