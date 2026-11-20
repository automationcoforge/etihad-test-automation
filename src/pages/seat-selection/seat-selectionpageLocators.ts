import type { Locator, Page } from '@playwright/test';

export class SeatSelectionPageLocators {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByText('Seat selection', { exact: true });
  }

  get addSeatsLaterButton(): Locator {
    return this.page.getByRole('button', { name: 'Add seats later', exact: true });
  }

  get seatConfirmationDialog(): Locator {
    return this.page.getByRole('dialog');
  }

  get confirmationContinueButton(): Locator {
    return this.seatConfirmationDialog.getByRole('button', { name: 'Continue', exact: true });
  }

  flightTab(route: string): Locator {
    return this.page.getByRole('tab', { name: route, exact: true });
  }

  seat(seatNumber: string): Locator {
    return this.page.getByRole('gridcell', { name: seatNumber, exact: true });
  }
}
