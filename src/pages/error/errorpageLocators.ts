import type { Locator, Page } from '@playwright/test';

export class ErrorPageLocators {
  constructor(private readonly page: Page) {}

  get errorTitle(): Locator {
    return this.page.getByText('Error message', { exact: true });
  }

  get errorMessage(): Locator {
    return this.page.getByText(/An unexpected error occurred while processing your request/);
  }

  get technicalReference(): Locator {
    return this.page.getByText(/Technical reference:/);
  }

  get retryButton(): Locator {
    return this.page.getByRole('button', { name: /Unable to proceed, please try again/ });
  }

  get goHomeButton(): Locator {
    return this.page.getByRole('button', { name: 'Go home', exact: true });
  }
}
