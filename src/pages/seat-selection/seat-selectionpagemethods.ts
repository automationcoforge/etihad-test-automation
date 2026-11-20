import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import { SeatSelectionPageLocators } from './seat-selectionpageLocators';

export class SeatSelectionPageMethods extends BasePage {
  readonly locators: SeatSelectionPageLocators;

  constructor(page: Page) {
    super(page, 'Seat selection');
    this.locators = new SeatSelectionPageLocators(page);
  }

  async selectFlight(route: string): Promise<void> {
    await this.steps.run(`Select flight ${route} for seat selection`, async () => {
      await this.ui.click(this.locators.flightTab(route), `flight ${route}`);
    });
  }

  async selectSeat(seatNumber: string): Promise<void> {
    await this.steps.run(`Select seat ${seatNumber}`, async () => {
      const seat = this.locators.seat(seatNumber);
      await this.ui.waitFor(seat, 'visible', `seat ${seatNumber}`);
      if (!(await seat.isEnabled())) {
        throw new Error(`Seat ${seatNumber} is not available.`);
      }
      await this.ui.click(seat, `seat ${seatNumber}`);
    });
  }

  async continueWithoutSeats(): Promise<void> {
    await this.steps.run('Continue without selecting seats', async () => {
      await this.ui.click(this.locators.addSeatsLaterButton, 'add seats later');
      await this.locators.seatConfirmationDialog.waitFor({ state: 'visible' });
      await this.ui.click(this.locators.confirmationContinueButton, 'confirm without seats');
      await this.locators.seatConfirmationDialog.waitFor({ state: 'hidden' });
    });
  }
}
