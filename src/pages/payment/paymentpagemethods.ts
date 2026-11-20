import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import type { PaymentCardDetails } from '../../models/bookingDetails';
import { PaymentPageLocators } from './paymentpageLocators';

export class PaymentPageMethods extends BasePage {
  readonly locators: PaymentPageLocators;

  constructor(page: Page) {
    super(page, 'Payment');
    this.locators = new PaymentPageLocators(page);
  }

  async fillCardDetails(card: PaymentCardDetails): Promise<void> {
    await this.steps.run('Enter payment card details', async () => {
      await this.ui.fill(this.locators.cardNumberField, card.cardNumber, 'card number');
      await this.ui.fill(this.locators.cardholderNameField, card.cardholderName, 'cardholder name');
      await this.ui.fill(this.locators.expiryMonthField, card.expiryMonth, 'card expiry month');
      await this.ui.fill(this.locators.expiryYearField, card.expiryYear, 'card expiry year');
      await this.ui.fill(this.locators.securityCodeField, card.securityCode, 'card security code');

      if (card.billingCountry) {
        await this.ui.click(this.locators.billingCountryField, 'billing country field');
        await this.ui.click(
          this.page.getByRole('option', { name: card.billingCountry, exact: true }),
          'billing country option',
        );
      }
    });
  }

  async acceptTerms(): Promise<void> {
    await this.steps.run('Accept the payment terms', async () => {
      const checkbox = this.locators.termsCheckbox;
      if (!(await checkbox.isChecked())) {
        await this.ui.check(checkbox, 'payment terms');
      }
    });
  }

  async isPayNowEnabled(): Promise<boolean> {
    return this.steps.run('Check if the Pay Now button is enabled', () =>
      this.locators.payNowButton.isEnabled(),
    );
  }
}
