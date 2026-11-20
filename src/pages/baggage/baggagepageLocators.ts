import type { Locator, Page } from '@playwright/test';

export class BaggagePageLocators {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Extra baggage', exact: true });
  }

  travelerPanel(name: string): Locator {
    return this.page
      .getByRole('tabpanel', { name, exact: true })
      .filter({ has: this.page.getByRole('heading', { name: 'Extra baggage', exact: true }) });
  }

  currentWeight(name: string): Locator {
    return this.travelerPanel(name).getByText(/^\d+kg$/);
  }

  incrementButton(name: string): Locator {
    return this.travelerPanel(name).getByRole('button', { name: '+', exact: true });
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue', exact: true });
  }

  flightTab(route: string): Locator {
    return this.page.getByRole('tab', { name: route, exact: true });
  }

  travelerTab(name: string): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }
}
