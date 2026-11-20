import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import { SeatSelectionPageMethods } from './seat-selectionpagemethods';

export class SeatSelectionPageFlows extends BaseFlow {
  readonly methods: SeatSelectionPageMethods;

  constructor(page: Page) {
    super('SeatSelectionPageFlows');
    this.methods = new SeatSelectionPageMethods(page);
  }

  async chooseSeat(route: string, seatNumber: string): Promise<void> {
    await this.steps.run(`Select seat ${seatNumber} for flight ${route}`, async () => {
      await this.methods.selectFlight(route);
      await this.methods.selectSeat(seatNumber);
    });
  }

  async skipSeatSelection(): Promise<void> {
    await this.steps.run('Continue without selecting seats', async () => {
      await this.methods.continueWithoutSeats();
    });
  }
}
