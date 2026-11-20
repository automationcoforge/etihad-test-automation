import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import { BaggagePageMethods } from './baggagepagemethods';

export class BaggagePageFlows extends BaseFlow {
  readonly methods: BaggagePageMethods;

  constructor(page: Page) {
    super('BaggagePageFlows');
    this.methods = new BaggagePageMethods(page);
  }

  async addBaggageForTraveler(
    route: string,
    travelerName: string,
    weightKg: number,
  ): Promise<void> {
    await this.steps.run(`Add ${weightKg} kg baggage for ${travelerName}`, async () => {
      await this.methods.selectFlight(route);
      await this.methods.selectTraveler(travelerName);
      await this.methods.addExtraBaggage(travelerName, weightKg);
    });
  }
}
