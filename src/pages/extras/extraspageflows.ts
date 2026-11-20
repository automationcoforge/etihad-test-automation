import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import { ExtrasPageMethods } from './extraspagemethods';

export class ExtrasPageFlows extends BaseFlow {
  readonly methods: ExtrasPageMethods;

  constructor(page: Page) {
    super('ExtrasPageFlows');
    this.methods = new ExtrasPageMethods(page);
  }

  async addAvailableAncillary(name: string): Promise<void> {
    await this.steps.run(`Add the ${name} ancillary`, async () => {
      await this.methods.addAncillary(name);
    });
  }

  async continueToPayment(): Promise<void> {
    await this.steps.run('Continue from extras to payment', async () => {
      await this.methods.checkout();
    });
  }
}
