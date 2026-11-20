import type { Locator, Page } from '@playwright/test';

export type TripType = 'Round trip' | 'One way' | 'Multi-city';

export class HomepageLocators {
  constructor(private readonly page: Page) {}

  get heroHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 }).first();
  }

  get homeLink(): Locator {
    return this.page.getByRole('link', { name: 'Etihad', exact: true });
  }

  get bookNavigationLink(): Locator {
    return this.page.getByRole('link', { name: 'Book', exact: true });
  }

  get manageNavigationLink(): Locator {
    return this.page.getByRole('link', { name: 'Manage', exact: true });
  }

  get checkInNavigationLink(): Locator {
    return this.page.getByRole('link', { name: 'Check-in', exact: true });
  }

  get flightStatusNavigationLink(): Locator {
    return this.page.getByRole('link', { name: 'Flight status', exact: true });
  }

  get cookieDialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Privacy' });
  }

  get rejectCookiesButton(): Locator {
    return this.page.getByRole('button', { name: 'Reject All' });
  }

  get searchButton(): Locator {
    return this.page.getByRole('button', { name: 'Search' })
      .filter({ visible: true })
      .first();
  }

  get searchButtons(): Locator {
    return this.page.getByText(/^(Search|Search Flights)$/);
  }

  get flightSearchWidget(): Locator {
    return this.page.getByRole('tablist').filter({ has: this.tripTypeTab('Round trip') });
  }

  get addMultiCityFlightButton(): Locator {
    return this.page.getByText('Add Flight', { exact: true });
  }

  get originInput(): Locator {
    return this.page.getByPlaceholder('Origin');
  }

  get destinationInput(): Locator {
    return this.page.getByPlaceholder('Destination');
  }

  airportSummaryTab(field: 'origin' | 'destination'): Locator {
    const name = field === 'origin' ? /^[A-Z]{3}\s+.+$/ : /^To\s+.+$/;
    return this.page.getByRole('tab', { name }).first();
  }

  get travelDateTab(): Locator {
    return this.page.getByRole('tab', { name: /Travelling when/ });
  }

  get guestCabinSummary(): Locator {
    return this.page.getByText(/^\d+ Guests?, (?:Economy|Business|First)$/);
  }

  get guestCabinCard(): Locator {
    return this.page.locator('.ey-fsp-stat--card.ey-fsp-stat--guest-and-date').first();
  }

  get passengerPanel(): Locator {
    return this.page
      .locator('.ey-fsp-stat-expanded-panel')
      .filter({ has: this.page.getByRole('tab', { name: 'Economy', exact: true }) })
      .first();
  }

  get applyPassengerButton(): Locator {
    return this.passengerPanel.getByRole('button', { name: 'Continue', exact: true });
  }

  get calendarMonthButtons(): Locator {
    return this.page.locator('.mbsc-calendar-title-wrapper button');
  }

  get activeCalendarMonths(): Locator {
    return this.page.locator('.mbsc-calendar-slide-active');
  }

  get previousCalendarPageButton(): Locator {
    return this.page.getByRole('button', { name: 'Previous page', exact: true });
  }

  get nextCalendarPageButton(): Locator {
    return this.page.getByRole('button', { name: 'Next page', exact: true });
  }

  get searchCarouselNextButtons(): Locator {
    return this.page.locator('.cmp-carousel__action--next');
  }

  get searchCarouselPreviousButtons(): Locator {
    return this.page.locator('.cmp-carousel__action--previous');
  }

  get airportOptions(): Locator {
    return this.page.getByRole('listbox', { name: 'menu-options' }).getByRole('option');
  }

  get popularDestinationsHeading(): Locator {
    return this.page.getByText('Popular destinations', { exact: true });
  }

  get nearbyAirportsHeading(): Locator {
    return this.page.getByText(/nearby airports/i);
  }

  passengerRow(category: string): Locator {
    return this.passengerPanel.getByText(category, { exact: true }).locator('xpath=../..');
  }

  passengerCountInput(category: string): Locator {
    return this.passengerRow(category).locator('input.ey-input');
  }

  passengerIncrementButton(category: string): Locator {
    return this.passengerRow(category).locator('button.ey-increment');
  }

  passengerDecrementButton(category: string): Locator {
    return this.passengerRow(category).locator('button.ey-decrement');
  }

  cabinTab(cabin: 'Economy' | 'Business' | 'First'): Locator {
    const cabinIndex = { Economy: 0, Business: 1, First: 2 }[cabin];
    return this.passengerPanel.locator(`label[for="Guest-Menu-Comp~${cabinIndex}"]`);
  }

  cabinInput(cabin: 'Economy' | 'Business' | 'First'): Locator {
    const cabinIndex = { Economy: 0, Business: 1, First: 2 }[cabin];
    return this.passengerPanel.locator(`input[id="Guest-Menu-Comp~${cabinIndex}"]`);
  }

  multiCityOriginInput(index: number): Locator {
    return this.page.locator(`#multicityOrigin${index}`);
  }

  multiCityDestinationInput(index: number): Locator {
    return this.page.locator(`#multicityDestination${index}`);
  }

  multiCityDateField(index: number): Locator {
    return this.page
      .locator('.ey-fsp-stat--milticity .ey-fsp-stat--block')
      .nth(index)
      .locator('.ey-fsp-stat--card')
      .nth(2);
  }

  calendarDay(monthIndex: number, day: number): Locator {
    return this.activeCalendarMonths
      .nth(monthIndex)
      .locator(
        `.mbsc-calendar-day:not(.mbsc-disabled):not(.mbsc-calendar-day-outer):not(.mbsc-calendar-day-empty):has(.mbsc-calendar-cell-inner > div:text-is("${day}"))`,
      );
  }

  carouselNextButton(sectionHeading: string): Locator {
    const carousel = this.page
      .locator('.cmp-carousel')
      .filter({ has: this.page.getByRole('heading', { name: sectionHeading, exact: true }) });
    return carousel.locator('.cmp-carousel__action--next');
  }

  carouselPreviousButton(sectionHeading: string): Locator {
    const carousel = this.page
      .locator('.cmp-carousel')
      .filter({ has: this.page.getByRole('heading', { name: sectionHeading, exact: true }) });
    return carousel.locator('.cmp-carousel__action--previous');
  }

  tripTypeTab(type: TripType): Locator {
    const accessibleName = type === 'One way' ? 'One-way' : type;
    return this.page.getByRole('tab', { name: accessibleName, exact: true });
  }
}
