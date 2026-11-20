import type { Locator, Page } from '@playwright/test';

export class LoungePageLocators {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Business Lounge access', exact: true });
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue', exact: true });
  }

  flightTab(route: string): Locator {
    return this.page.getByRole('tab', { name: route, exact: true });
  }

  guestCheckbox(name: string): Locator {
    return this.page.getByRole('checkbox', { name: new RegExp(escapeRegExp(name), 'i') });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
