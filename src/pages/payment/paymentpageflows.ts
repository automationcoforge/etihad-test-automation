import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import type { PaymentCardDetails } from '../../models/bookingDetails';
import { PaymentPageMethods } from './paymentpagemethods';

export class PaymentPageFlows extends BaseFlow {
  readonly methods: PaymentPageMethods;

  constructor(page: Page) {
    super('PaymentPageFlows');
    this.methods = new PaymentPageMethods(page);
  }

  async enterCardDetails(card: PaymentCardDetails): Promise<void> {
    await this.steps.run('Enter payment card details', async () => {
      await this.methods.fillCardDetails(card);
    });
  }

  async acceptPaymentTerms(): Promise<void> {
    await this.steps.run('Accept the payment terms', async () => {
      await this.methods.acceptTerms();
    });
  }

  async canSubmitPayment(): Promise<boolean> {
    return this.steps.run('Check whether payment can be submitted', async () =>
      this.methods.isPayNowEnabled(),
    );
  }
}
