import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import { ErrorPageLocators } from './errorpageLocators';

export class ErrorPageMethods extends BasePage {
  readonly locators: ErrorPageLocators;

  constructor(page: Page) {
    super(page, 'Error page');
    this.locators = new ErrorPageLocators(page);
  }

  async getMessage(): Promise<string> {
    return this.steps.run('Read the booking error message', async () =>
      (await this.locators.errorMessage.innerText()).trim(),
    );
  }

  async getTechnicalReference(): Promise<string> {
    return this.steps.run('Read the technical error reference', async () =>
      (await this.locators.technicalReference.innerText()).trim(),
    );
  }

  async retry(): Promise<void> {
    await this.steps.run('Retry the failed booking action', async () => {
      await this.ui.click(this.locators.retryButton, 'retry');
    });
  }

  async goHome(): Promise<void> {
    await this.steps.run('Return to the homepage from the error page', async () => {
      await this.ui.click(this.locators.goHomeButton, 'go home');
    });
  }
}
