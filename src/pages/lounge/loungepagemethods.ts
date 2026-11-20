import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import { LoungePageLocators } from './loungepageLocators';

export class LoungePageMethods extends BasePage {
  readonly locators: LoungePageLocators;

  constructor(page: Page) {
    super(page, 'Lounge');
    this.locators = new LoungePageLocators(page);
  }

  async selectFlight(route: string): Promise<void> {
    await this.steps.run(`Select flight ${route} for lounge access`, async () => {
      await this.ui.click(this.locators.flightTab(route), `flight ${route}`);
    });
  }

  async selectGuests(names: string[]): Promise<void> {
    await this.steps.run('Select guests for lounge access', async () => {
      if (names.length === 0) {
        throw new TypeError('At least one guest must be selected for lounge access.');
      }
      for (const name of names) {
        const guest = this.locators.guestCheckbox(name);
        await this.ui.waitFor(guest, 'visible', `guest ${name}`);
        if (!(await guest.isChecked())) {
          await this.ui.check(guest, `guest ${name}`);
        }
      }
    });
  }

  async continue(): Promise<void> {
    await this.steps.run('Continue from lounge selection', async () => {
      await this.ui.click(this.locators.continueButton, 'continue from lounge');
    });
  }
}
