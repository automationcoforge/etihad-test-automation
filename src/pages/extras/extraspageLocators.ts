import type { Locator, Page } from '@playwright/test';

export class ExtrasPageLocators {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Extras', exact: true });
  }

  get checkoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Check out', exact: true });
  }

  get loungePromptDialog(): Locator {
    return this.page
      .getByRole('dialog')
      .filter({ has: this.page.getByRole('heading', { name: 'Lounge access not included', exact: true }) });
  }

  get continueWithoutLoungeButton(): Locator {
    return this.loungePromptDialog
      .getByRole('button', { name: 'Continue without lounge', exact: true })
      .last();
  }

  ancillaryCard(name: string): Locator {
    return this.page.getByText(name, { exact: true }).locator('xpath=../..');
  }

  ancillaryAddButton(name: string): Locator {
    return this.ancillaryCard(name).getByRole('button', { name: 'Add', exact: true });
  }
}
