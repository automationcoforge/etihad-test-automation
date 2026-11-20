import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import { BaggagePageLocators } from './baggagepageLocators';

const BAGGAGE_INCREMENT_KG = 5;

export class BaggagePageMethods extends BasePage {
  readonly locators: BaggagePageLocators;

  constructor(page: Page) {
    super(page, 'Baggage');
    this.locators = new BaggagePageLocators(page);
  }

  async selectFlight(route: string): Promise<void> {
    await this.steps.run(`Select flight ${route} for baggage`, async () => {
      await this.ui.click(this.locators.flightTab(route), `flight ${route}`);
    });
  }

  async selectTraveler(name: string): Promise<void> {
    await this.steps.run(`Select traveler ${name} for baggage`, async () => {
      await this.ui.click(this.locators.travelerTab(name), `traveler ${name}`);
    });
  }

  async addExtraBaggage(travelerName: string, targetWeightKg: number): Promise<void> {
    await this.steps.run(`Add ${targetWeightKg} kg extra baggage for ${travelerName}`, async () => {
      if (!Number.isInteger(targetWeightKg) || targetWeightKg < 0) {
        throw new TypeError('Extra baggage weight must be a non-negative integer.');
      }
      if (targetWeightKg % BAGGAGE_INCREMENT_KG !== 0) {
        throw new RangeError(`Extra baggage must be added in ${BAGGAGE_INCREMENT_KG} kg increments.`);
      }

      const currentText = await this.locators.currentWeight(travelerName).innerText();
      let currentWeight = Number(currentText.replace('kg', ''));
      if (!Number.isInteger(currentWeight)) {
        throw new Error(`Could not read the current extra baggage weight: "${currentText}".`);
      }
      if (targetWeightKg < currentWeight) {
        throw new RangeError(
          `Cannot reduce the current extra baggage weight from ${currentWeight} kg to ${targetWeightKg} kg.`,
        );
      }

      while (currentWeight < targetWeightKg) {
        await this.ui.click(
          this.locators.incrementButton(travelerName),
          `add baggage for ${travelerName}`,
        );
        const updatedText = await this.locators.currentWeight(travelerName).innerText();
        const updatedWeight = Number(updatedText.replace('kg', ''));
        if (!Number.isInteger(updatedWeight) || updatedWeight <= currentWeight) {
          throw new Error('The extra baggage selector did not increase the selected weight.');
        }
        if (updatedWeight > targetWeightKg) {
          throw new RangeError(
            `The extra baggage selector increased the weight to ${updatedWeight} kg, above the requested ${targetWeightKg} kg.`,
          );
        }
        if (updatedWeight - currentWeight !== BAGGAGE_INCREMENT_KG) {
          throw new Error(
            `Expected a ${BAGGAGE_INCREMENT_KG} kg baggage increment, received ${updatedWeight - currentWeight} kg.`,
          );
        }
        currentWeight = updatedWeight;
      }
    });
  }

  async continue(): Promise<void> {
    await this.steps.run('Continue from baggage selection', async () => {
      await this.ui.click(this.locators.continueButton, 'continue from baggage');
    });
  }
}
