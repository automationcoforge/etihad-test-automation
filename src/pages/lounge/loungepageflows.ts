import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import { LoungePageMethods } from './loungepagemethods';

export class LoungePageFlows extends BaseFlow {
  readonly methods: LoungePageMethods;

  constructor(page: Page) {
    super('LoungePageFlows');
    this.methods = new LoungePageMethods(page);
  }

  async addLoungeAccess(route: string, guestNames: string[]): Promise<void> {
    await this.steps.run('Add lounge access for selected guests', async () => {
      await this.methods.selectFlight(route);
      await this.methods.selectGuests(guestNames);
      await this.methods.continue();
    });
  }
}
