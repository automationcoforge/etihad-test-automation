import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import { ErrorPageMethods } from './errorpagemethods';

export class ErrorPageFlows extends BaseFlow {
  readonly methods: ErrorPageMethods;

  constructor(page: Page) {
    super('ErrorPageFlows');
    this.methods = new ErrorPageMethods(page);
  }

  async recoverToHomepage(): Promise<void> {
    await this.steps.run('Recover from the error page to the homepage', async () => {
      await this.methods.goHome();
    });
  }
}
