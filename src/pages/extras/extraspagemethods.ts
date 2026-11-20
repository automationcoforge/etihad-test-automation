import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import { ExtrasPageLocators } from './extraspageLocators';

export class ExtrasPageMethods extends BasePage {
  readonly locators: ExtrasPageLocators;

  constructor(page: Page) {
    super(page, 'Extras');
    this.locators = new ExtrasPageLocators(page);
  }

  async addAncillary(name: string): Promise<void> {
    await this.steps.run(`Add the ${name} ancillary`, async () => {
      const addButton = this.locators.ancillaryAddButton(name);
      await this.ui.waitFor(addButton, 'visible', `${name} add button`);
      if (!(await addButton.isEnabled())) {
        throw new Error(`${name} is not available to add.`);
      }
      await this.ui.click(addButton, `add ${name}`);
    });
  }

  async checkout(): Promise<void> {
    await this.steps.run('Continue from extras checkout', async () => {
      await this.ui.click(this.locators.checkoutButton, 'checkout');
      const loungePrompt = this.locators.loungePromptDialog;
      if (await loungePrompt.isVisible()) {
        await this.ui.click(this.locators.continueWithoutLoungeButton, 'continue without lounge');
        await loungePrompt.waitFor({ state: 'hidden' });
      }
    });
  }
}
