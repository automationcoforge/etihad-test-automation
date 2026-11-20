import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import type { GuestContactDetails, TravelerDetails } from '../../models/bookingDetails';
import { GuestInfoPageMethods } from './guest-infopagemethods';

export class GuestInfoPageFlows extends BaseFlow {
  readonly methods: GuestInfoPageMethods;

  constructor(page: Page) {
    super('GuestInfoPageFlows');
    this.methods = new GuestInfoPageMethods(page);
  }

  async enterGuestAndContactInformation(
    travelers: TravelerDetails[],
    visibleDateOfBirths: string[],
    contact: GuestContactDetails,
  ): Promise<void> {
    await this.steps.run('Enter traveler and contact information', async () => {
      await this.methods.fillTravelerNames(travelers);
      await this.methods.fillVisibleDateOfBirths(visibleDateOfBirths);
      await this.methods.fillContactDetails(contact);
    });
  }

  async continueToSeatSelection(additionalAdultDateOfBirths: string[] = []): Promise<void> {
    await this.steps.run('Continue to seat selection', async () => {
      await this.methods.continue();
      if (additionalAdultDateOfBirths.length > 0) {
        await this.methods.fillMissingDateOfBirths(additionalAdultDateOfBirths);
        await this.methods.continue();
      }
    });
  }
}
