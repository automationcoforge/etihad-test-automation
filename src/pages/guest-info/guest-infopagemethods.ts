import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import type {
  GuestContactDetails,
  TravelerDetails,
} from '../../models/bookingDetails';
import { GuestInfoPageLocators } from './guest-infopageLocators';

export class GuestInfoPageMethods extends BasePage {
  readonly locators: GuestInfoPageLocators;

  constructor(page: Page) {
    super(page, 'Guest information');
    this.locators = new GuestInfoPageLocators(page);
  }

  async fillTravelerNames(travelers: TravelerDetails[]): Promise<void> {
    await this.steps.run('Enter traveler names and titles', async () => {
      const firstNames = this.locators.firstNameFields;
      const lastNames = this.locators.lastNameFields;
      const firstNameCount = await firstNames.count();
      const lastNameCount = await lastNames.count();

      if (firstNameCount !== travelers.length || lastNameCount !== travelers.length) {
        throw new Error(
          `Expected ${travelers.length} traveler forms, but found ${firstNameCount} first-name and ${lastNameCount} last-name fields.`,
        );
      }

      const titles = travelers.filter((traveler) => traveler.title);
      const titleFields = this.locators.titleFields;
      if ((await titleFields.count()) !== titles.length) {
        throw new Error('The title fields do not match the supplied traveler details.');
      }

      const genders = travelers.filter((traveler) => traveler.gender);
      const genderFields = this.locators.genderFields;
      if ((await genderFields.count()) !== genders.length) {
        throw new Error('The gender fields do not match the supplied traveler details.');
      }

      let titleIndex = 0;
      let genderIndex = 0;
      for (let index = 0; index < travelers.length; index += 1) {
        const traveler = travelers[index];
        await this.ui.fill(firstNames.nth(index), traveler.firstName, `traveler ${index + 1} first name`);
        await this.ui.fill(lastNames.nth(index), traveler.lastName, `traveler ${index + 1} last name`);

        if (traveler.title) {
          await this.selectOption(titleFields.nth(titleIndex), traveler.title);
          titleIndex += 1;
        }

        if (traveler.gender) {
          await this.selectOption(genderFields.nth(genderIndex), traveler.gender);
          genderIndex += 1;
        }
      }
    });
  }

  async fillVisibleDateOfBirths(dateOfBirths: string[]): Promise<void> {
    await this.steps.run('Enter visible traveler dates of birth', async () => {
      const fields = this.locators.dateOfBirthFields;
      const availableCount = await fields.count();
      if (dateOfBirths.length > availableCount) {
        throw new Error(
          `Cannot fill ${dateOfBirths.length} dates of birth; only ${availableCount} fields are visible.`,
        );
      }

      for (let index = 0; index < dateOfBirths.length; index += 1) {
        await this.ui.fill(fields.nth(index), dateOfBirths[index], `traveler ${index + 1} date of birth`);
      }
    });
  }

  async fillMissingDateOfBirths(dateOfBirths: string[]): Promise<void> {
    await this.steps.run('Enter missing traveler dates of birth', async () => {
      const fields = this.locators.dateOfBirthFields;
      const count = await fields.count();
      const emptyFields: number[] = [];

      for (let index = 0; index < count; index += 1) {
        if (!(await fields.nth(index).inputValue())) {
          emptyFields.push(index);
        }
      }

      if (emptyFields.length !== dateOfBirths.length) {
        throw new Error(
          `Expected ${dateOfBirths.length} missing dates of birth, but found ${emptyFields.length}.`,
        );
      }

      for (let index = 0; index < emptyFields.length; index += 1) {
        await this.ui.fill(
          fields.nth(emptyFields[index]),
          dateOfBirths[index],
          `missing traveler date of birth ${index + 1}`,
        );
      }
    });
  }

  async fillContactDetails(contact: GuestContactDetails): Promise<void> {
    await this.steps.run('Enter primary guest and contact details', async () => {
      await this.ui.click(this.locators.primaryGuestField, 'primary guest field');
      await this.ui.click(this.locators.guestOption(contact.primaryGuest), 'primary guest option');

      const dialCode = await this.findDialCodeField();
      if ((await dialCode.inputValue()) !== contact.dialCode) {
        await this.ui.fill(dialCode, contact.dialCode, 'calling code');
        await this.ui.click(
          this.page.getByRole('option', { name: contact.dialCode, exact: true }),
          'calling code option',
        );
      }

      await this.ui.fill(this.locators.contactNumberField, contact.phoneNumber, 'contact number');
      await this.ui.fill(this.locators.emailField, contact.email, 'email address');
    });
  }

  async continue(): Promise<void> {
    await this.steps.run('Continue from guest information', async () => {
      await this.ui.click(this.locators.continueButton, 'continue from guest information');
    });
  }

  private async selectOption(field: Locator, option: string): Promise<void> {
    await this.steps.run(`Select ${option} from the dropdown`, async () => {
      await this.ui.click(field, 'open selection field');
      await this.ui.click(
        this.page.getByRole('option', { name: option, exact: true }),
        `select ${option}`,
      );
    });
  }

  private async findDialCodeField(): Promise<Locator> {
    return this.steps.run('Locate the country calling-code field', async () => {
      const inputComboboxes = this.page.locator('input[role="combobox"]');
      const count = await inputComboboxes.count();

      for (let index = 0; index < count; index += 1) {
        const field = inputComboboxes.nth(index);
        if (/^\+\d{1,4}$/.test(await field.inputValue())) {
          return field;
        }
      }

      throw new Error('Could not locate the country calling-code field.');
    });
  }
}
