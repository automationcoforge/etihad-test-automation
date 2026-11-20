import type { Locator, Page } from '@playwright/test';

export class GuestInfoPageLocators {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Guest information', exact: true });
  }

  get titleFields(): Locator {
    return this.page.getByRole('combobox', { name: 'Title' });
  }

  get firstNameFields(): Locator {
    return this.page.getByRole('textbox', { name: 'First name' });
  }

  get lastNameFields(): Locator {
    return this.page.getByRole('textbox', { name: 'Last name' });
  }

  get dateOfBirthFields(): Locator {
    return this.page.getByRole('textbox', { name: 'Date of birth' });
  }

  get genderFields(): Locator {
    return this.page.getByRole('combobox', { name: 'Gender' });
  }

  get primaryGuestField(): Locator {
    return this.page.getByRole('combobox', { name: 'Select guest' });
  }

  get contactNumberField(): Locator {
    return this.page.getByRole('textbox', { name: 'Contact number' });
  }

  get emailField(): Locator {
    return this.page.getByRole('combobox', { name: 'Email address' });
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue', exact: true });
  }

  guestOption(name: string): Locator {
    return this.page.getByRole('option', { name: new RegExp(escapeRegExp(name), 'i') });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
