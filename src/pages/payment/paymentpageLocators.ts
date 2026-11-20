import type { Locator, Page } from '@playwright/test';

export class PaymentPageLocators {
  constructor(private readonly page: Page) {}

  get cardNumberField(): Locator {
    return this.page.getByRole('textbox', { name: 'Card number' });
  }

  get cardholderNameField(): Locator {
    return this.page.getByRole('textbox', { name: 'Card holder name' });
  }

  get expiryMonthField(): Locator {
    return this.page.getByRole('textbox', { name: 'Expiry' });
  }

  get expiryYearField(): Locator {
    return this.page.getByRole('textbox', { name: 'YY' });
  }

  get securityCodeField(): Locator {
    return this.page.getByRole('textbox', { name: 'CVV / CVC' });
  }

  get emailField(): Locator {
    return this.page.getByRole('combobox', { name: 'Email address' });
  }

  get billingCountryField(): Locator {
    return this.page.getByRole('combobox', { name: 'Country' });
  }

  get termsCheckbox(): Locator {
    return this.page.getByRole('checkbox', {
      name: 'By clicking this box, I agree to the terms and conditions and fare rules',
    });
  }

  get payNowButton(): Locator {
    return this.page.getByRole('button', { name: 'Pay now', exact: true });
  }

  get heading(): Locator {
    return this.page.getByText('How would you like to pay?', { exact: true });
  }
}
