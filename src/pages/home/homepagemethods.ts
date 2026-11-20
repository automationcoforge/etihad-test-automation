import type { Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import type {
  CabinClass,
  FlightSearchLeg,
  PassengerCategory,
  PassengerCounts,
} from '../../models/flightSearchCriteria';
import {
  getTotalPassengers,
  validateDifferentAirports,
  validatePassengerCounts,
} from '../../utils/flightSearch.utils';
import { HomepageLocators, type TripType } from './homepageLocators';
import { DateUtils } from '../../utils/date.utils';

const PASSENGER_CATEGORIES: Record<keyof PassengerCounts, PassengerCategory> = {
  adults: 'Adults',
  children: 'Children',
  infants: 'Infants',
  infantsWithSeat: 'Infants with Seat',
  youngAdults: 'Young Adults',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class HomepageMethods extends BasePage {
  readonly locators: HomepageLocators;

  constructor(page: Page) {
    super(page, 'Homepage');
    this.locators = new HomepageLocators(page);
  }

  async open(): Promise<void> {
    await this.steps.run('Navigate to the Etihad homepage', async () => {
      await this.ui.navigate('./', 'homepage');
    });
  }

  async selectTripType(type: TripType): Promise<void> {
    await this.steps.run(`Select the ${type} trip type`, async () => {
      await this.ui.click(this.locators.tripTypeTab(type), `${type} trip type`);
    });
  }

  async selectOrigin(query: string, optionMatch = query): Promise<string> {
    return this.steps.run('Select the origin airport', () =>
      this.selectAirport(this.locators.originInput, query, optionMatch, 'origin'),
    );
  }

  async selectDestination(query: string, optionMatch = query): Promise<string> {
    return this.steps.run('Select the destination airport', () =>
      this.selectAirport(this.locators.destinationInput, query, optionMatch, 'destination'),
    );
  }

  async getOriginSuggestions(query: string): Promise<string[]> {
    return this.steps.run('Get matching origin airport suggestions', () =>
      this.searchAirportSuggestions(this.locators.originInput, query, 'origin'),
    );
  }

  async getDestinationSuggestions(query: string): Promise<string[]> {
    return this.steps.run('Get matching destination airport suggestions', () =>
      this.searchAirportSuggestions(this.locators.destinationInput, query, 'destination'),
    );
  }

  async getPopularDestinations(field: 'origin' | 'destination'): Promise<string[]> {
    return this.steps.run(`Get popular ${field} destinations`, async () => {
      const input = field === 'origin' ? this.locators.originInput : this.locators.destinationInput;
      await this.prepareAirportInput(input, field);
      await this.ui.click(input, `${field} airport field`);
      await this.locators.popularDestinationsHeading.waitFor({ state: 'visible' });
      return (await this.locators.airportOptions.allInnerTexts()).map((text) =>
        text.replace(/\s+/g, ' ').trim(),
      );
    });
  }

  async isAirportControlVisible(field: 'origin' | 'destination'): Promise<boolean> {
    return this.steps.run(`Check whether the ${field} airport control is visible`, async () => {
      const input = field === 'origin' ? this.locators.originInput : this.locators.destinationInput;
      return (await input.isVisible()) || (await this.locators.airportSummaryTab(field).isVisible());
    });
  }

  async selectMultiCitySegments(segments: FlightSearchLeg[]): Promise<void> {
    await this.steps.run('Enter all multi-city flight segments', async () => {
      for (let index = 0; index < segments.length; index += 1) {
        const originInput = this.locators.multiCityOriginInput(index);
        if (!(await originInput.isVisible())) {
          await this.ui.click(this.locators.addMultiCityFlightButton, 'add multi-city segment');
          await originInput.waitFor({ state: 'visible' });
        }

        const segment = segments[index];
        const selectedOrigin = await this.selectAirport(
          originInput,
          segment.origin.query,
          segment.origin.optionMatch ?? segment.origin.query,
        );
        const selectedDestination = await this.selectAirport(
          this.locators.multiCityDestinationInput(index),
          segment.destination.query,
          segment.destination.optionMatch ?? segment.destination.query,
        );
        validateDifferentAirports(
          { query: selectedOrigin },
          { query: selectedDestination },
        );
        if (!(await this.locators.calendarMonthButtons.first().isVisible())) {
          await this.ui.click(this.locators.multiCityDateField(index), `segment ${index + 1} date`);
        }
        await this.locators.calendarMonthButtons.first().waitFor({ state: 'visible' });
        await this.selectCalendarDate(segment.departureDate);
      }
    });
  }

  async openPassengerAndCabinPanel(): Promise<void> {
    await this.steps.run('Open the passenger and cabin panel', async () => {
      await this.ui.click(this.locators.guestCabinCard, 'guest and cabin panel');
      await this.locators.passengerPanel.waitFor({ state: 'visible' });
    });
  }

  async setPassengerCount(category: PassengerCategory, targetCount: number): Promise<void> {
    await this.steps.run(`Set the ${category} passenger count to ${targetCount}`, async () => {
      if (!Number.isInteger(targetCount) || targetCount < 0) {
        throw new TypeError('Passenger count must be a non-negative integer.');
      }

      const countInput = this.locators.passengerCountInput(category);
      let currentCount = Number(await countInput.inputValue());
      if (!Number.isInteger(currentCount)) {
        throw new Error(`Could not read the current ${category} count.`);
      }

      while (currentCount !== targetCount) {
        const incrementing = targetCount > currentCount;
        const control = incrementing
          ? this.locators.passengerIncrementButton(category)
          : this.locators.passengerDecrementButton(category);

        if (!(await control.isEnabled())) {
          throw new RangeError(
            `The Etihad passenger selector does not allow ${category} to be set to ${targetCount}.`,
          );
        }

        await this.ui.click(control, `${incrementing ? 'increase' : 'decrease'} ${category}`);
        currentCount = Number(await countInput.inputValue());
      }
    });
  }

  async setPassengerCounts(passengers: PassengerCounts): Promise<void> {
    await this.steps.run('Set and verify all passenger counts', async () => {
      validatePassengerCounts(passengers);

      await this.setPassengerCount('Adults', passengers.adults);
      await this.setPassengerCount('Children', passengers.children);
      await this.setPassengerCount('Infants', passengers.infants);
      await this.setPassengerCount('Infants with Seat', passengers.infantsWithSeat);
      const youngAdultCount = passengers.youngAdults ?? 0;
      const youngAdultInput = this.locators.passengerCountInput('Young Adults');
      if (await youngAdultInput.count()) {
        await this.setPassengerCount('Young Adults', youngAdultCount);
      } else if (youngAdultCount > 0) {
        throw new RangeError('The Etihad passenger selector does not offer a Young Adults category.');
      }

      const selectedCount = await this.getPassengerCounts();
      const actualCounts: Record<PassengerCategory, number> = {
        Adults: selectedCount.adults,
        Children: selectedCount.children,
        Infants: selectedCount.infants,
        'Infants with Seat': selectedCount.infantsWithSeat,
        'Young Adults': selectedCount.youngAdults ?? 0,
      };
      const expectedCounts: Array<[PassengerCategory, number]> = [
        ['Adults', passengers.adults],
        ['Children', passengers.children],
        ['Infants', passengers.infants],
        ['Infants with Seat', passengers.infantsWithSeat],
        ['Young Adults', passengers.youngAdults ?? 0],
      ];

      for (const [category, expectedCount] of expectedCounts) {
        if (actualCounts[category] !== expectedCount) {
          throw new Error(`The passenger selector did not apply the requested ${category} count.`);
        }
      }

      if (getTotalPassengers(selectedCount) !== getTotalPassengers(passengers)) {
        throw new Error('The passenger selector did not apply the requested passenger total.');
      }
    });
  }

  async getPassengerCounts(): Promise<PassengerCounts> {
    return this.steps.run('Read the current passenger counts', async () => ({
      adults: Number(await this.locators.passengerCountInput(PASSENGER_CATEGORIES.adults).inputValue()),
      children: Number(
        await this.locators.passengerCountInput(PASSENGER_CATEGORIES.children).inputValue(),
      ),
      infants: Number(await this.locators.passengerCountInput(PASSENGER_CATEGORIES.infants).inputValue()),
      infantsWithSeat: Number(
        await this.locators.passengerCountInput(PASSENGER_CATEGORIES.infantsWithSeat).inputValue(),
      ),
      youngAdults: await this.getYoungAdultCount(),
    }));
  }

  async selectCabin(cabin: CabinClass): Promise<void> {
    await this.steps.run(`Select and verify the ${cabin} cabin`, async () => {
      await this.ui.click(this.locators.cabinTab(cabin), `${cabin} cabin`);
      if (!(await this.locators.cabinInput(cabin).isChecked())) {
        throw new Error(`${cabin} cabin was not selected.`);
      }

      for (const otherCabin of ['Economy', 'Business', 'First'] as const) {
        if (otherCabin !== cabin && (await this.locators.cabinInput(otherCabin).isChecked())) {
          throw new Error(`Selecting ${cabin} left ${otherCabin} selected.`);
        }
      }
    });
  }

  async getSelectedCabin(): Promise<CabinClass> {
    return this.steps.run('Read the selected cabin class', async () => {
      const selectedCabins: CabinClass[] = [];
      for (const cabin of ['Economy', 'Business', 'First'] as const) {
        if (await this.locators.cabinInput(cabin).isChecked()) {
          selectedCabins.push(cabin);
        }
      }

      if (selectedCabins.length !== 1) {
        throw new Error(`Expected one selected cabin, found ${selectedCabins.length}.`);
      }

      return selectedCabins[0];
    });
  }

  async getGuestCabinSummary(): Promise<string> {
    return this.steps.run('Read the guest and cabin summary', async () => {
      await this.locators.guestCabinSummary.waitFor({ state: 'visible' });
      return (await this.locators.guestCabinSummary.innerText()).replace(/\s+/g, ' ').trim();
    });
  }

  async assertGuestCabinSummary(passengers: PassengerCounts, cabin: CabinClass): Promise<void> {
    await this.steps.run('Verify the guest and cabin summary', async () => {
      const total = getTotalPassengers(passengers);
      const expectedSummary = `${total} ${total === 1 ? 'Guest' : 'Guests'}, ${cabin}`;
      const actualSummary = await this.getGuestCabinSummary();
      if (actualSummary !== expectedSummary) {
        throw new Error(
          `Passenger summary mismatch: expected "${expectedSummary}", received "${actualSummary}".`,
        );
      }
    });
  }

  async applyPassengerAndCabinSelection(): Promise<void> {
    await this.steps.run('Apply passenger and cabin selections', async () => {
      await this.ui.click(this.locators.applyPassengerButton, 'apply passenger and cabin selection');
      await this.locators.passengerPanel.waitFor({ state: 'hidden' });
    });
  }

  async selectTravelDates(departureDate: number, returnDate?: number): Promise<void> {
    await this.steps.run('Select departure and return travel dates', async () => {
      await this.openTravelCalendar();
      await this.selectCalendarDate(departureDate);

      if (returnDate) {
        await this.openTravelCalendar();
        await this.selectCalendarDate(returnDate);
      }
    });
  }

  async searchFlights(): Promise<void> {
    await this.steps.run('Submit the flight search', async () => {
      await this.locators.searchButton.waitFor({ state: 'visible' });
      await this.ui.scrollIntoView(this.locators.searchButton, 'flight search button');
      await this.ui.click(this.locators.searchButton, 'search flights');
    });
  }

  async isTripTypeSelected(type: TripType): Promise<boolean> {
    return this.steps.run(`Check whether ${type} is the selected trip type`, async () =>
      (await this.locators.tripTypeTab(type).getAttribute('aria-selected')) === 'true',
    );
  }

  async navigateToBook(): Promise<void> {
    await this.steps.run('Open the booking navigation', async () => {
      await this.ui.click(this.locators.bookNavigationLink, 'book navigation');
    });
  }

  async navigateHome(): Promise<void> {
    await this.steps.run('Navigate to the homepage', async () => {
      await this.ui.click(this.locators.homeLink, 'home navigation');
    });
  }

  async navigateToManageBooking(): Promise<void> {
    await this.steps.run('Open manage booking', async () => {
      await this.ui.click(this.locators.manageNavigationLink, 'manage booking navigation');
    });
  }

  async navigateToCheckIn(): Promise<void> {
    await this.steps.run('Open check-in', async () => {
      await this.ui.click(this.locators.checkInNavigationLink, 'check-in navigation');
    });
  }

  async navigateToFlightStatus(): Promise<void> {
    await this.steps.run('Open flight status', async () => {
      await this.ui.click(this.locators.flightStatusNavigationLink, 'flight status navigation');
    });
  }

  async moveCarousel(sectionHeading: string, direction: 'next' | 'previous'): Promise<void> {
    await this.steps.run(`${direction === 'next' ? 'Advance' : 'Go back'} the ${sectionHeading} carousel`, async () => {
      const control =
        direction === 'next'
          ? this.locators.carouselNextButton(sectionHeading)
          : this.locators.carouselPreviousButton(sectionHeading);
      await this.ui.click(control, `${direction} ${sectionHeading} carousel`);
    });
  }

  async dismissCookieDialogIfVisible(): Promise<void> {
    await this.steps.run('Dismiss the cookie consent dialog if shown', async () => {
      if (await this.locators.cookieDialog.isVisible()) {
        await this.ui.click(this.locators.rejectCookiesButton, 'reject cookies');
        await this.locators.cookieDialog.waitFor({ state: 'hidden' });
      }
    });
  }

  private async selectAirport(
    input: typeof this.locators.originInput,
    query: string,
    optionMatch: string,
    field?: 'origin' | 'destination',
  ): Promise<string> {
    return this.steps.run('Match and select the requested airport', async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        throw new TypeError('Airport search text cannot be empty.');
      }

      const options = this.locators.airportOptions;
      const optionTexts = await this.searchAirportSuggestions(input, trimmedQuery, field);
      const normalizedMatch = optionMatch.replace(/\s+/g, ' ').toLocaleLowerCase();
      const optionIndex = optionTexts.findIndex((text) =>
        text.replace(/\s+/g, ' ').toLocaleLowerCase().includes(normalizedMatch),
      );
      if (optionIndex < 0) {
        throw new Error(`Could not find an airport suggestion matching "${optionMatch}".`);
      }

      if (!(await options.nth(optionIndex).isEnabled())) {
        throw new RangeError(`Airport suggestion "${optionMatch}" is not active for booking.`);
      }

      for (let index = 0; index <= optionIndex; index += 1) {
        await this.ui.press(input, 'ArrowDown', 'airport suggestion');
      }
      if ((await options.nth(optionIndex).getAttribute('aria-selected')) !== 'true') {
        throw new Error(`Could not select the airport suggestion matching "${optionMatch}".`);
      }

      await this.ui.press(input, 'Enter', 'select airport suggestion');
      if (!(await input.inputValue()).toLocaleLowerCase().includes(trimmedQuery.toLocaleLowerCase())) {
        throw new Error(`The airport field did not select "${trimmedQuery}".`);
      }
      return input.inputValue();
    });
  }

  private async searchAirportSuggestions(
    input: typeof this.locators.originInput,
    query: string,
    field?: 'origin' | 'destination',
  ): Promise<string[]> {
    return this.steps.run(`Search for ${field ?? 'airport'} suggestions`, async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        throw new TypeError('Airport search text cannot be empty.');
      }

      await this.prepareAirportInput(input, field);
      await this.ui.fill(input, trimmedQuery, `search ${field ?? 'airport'} suggestions`);
      await this.locators.airportOptions.first().waitFor({ state: 'visible' });
      return this.locators.airportOptions.allInnerTexts();
    });
  }

  private async prepareAirportInput(
    input: typeof this.locators.originInput,
    field?: 'origin' | 'destination',
  ): Promise<void> {
    await this.steps.run(`Open the ${field ?? 'airport'} input`, async () => {
      if (await input.isVisible()) {
        return;
      }

      if (!field) {
        await input.waitFor({ state: 'visible' });
        return;
      }

      await this.ui.click(this.locators.airportSummaryTab(field), `${field} airport summary`);
      await input.waitFor({ state: 'visible' });
    });
  }

  private async getYoungAdultCount(): Promise<number> {
    return this.steps.run('Read the young adult passenger count', async () => {
      const input = this.locators.passengerCountInput('Young Adults');
      if (!(await input.count())) {
        return 0;
      }

      const count = Number(await input.inputValue());
      if (!Number.isInteger(count) || count < 0) {
        throw new Error('Could not read the current Young Adults count.');
      }
      return count;
    });
  }

  private async openTravelCalendar(): Promise<void> {
    await this.steps.run('Open the travel date calendar', async () => {
      if (!(await this.locators.calendarMonthButtons.first().isVisible())) {
        await this.ui.click(this.locators.travelDateTab, 'travel date calendar');
      }
      await this.locators.calendarMonthButtons.first().waitFor({ state: 'visible' });
    });
  }

  private async selectCalendarDate(daysFromToday: number): Promise<void> {
    await this.steps.run(`Select a travel date ${daysFromToday} days from today`, async () => {
      const date = await this.parseIsoDate(await DateUtils.getDate(daysFromToday));
      const monthOrdinal = date.getUTCFullYear() * 12 + date.getUTCMonth();
      const monthHeaders = this.locators.calendarMonthButtons;
      let monthIndex = -1;

      for (let attempt = 0; attempt < 24; attempt += 1) {
        const headerCount = await monthHeaders.count();
        if (headerCount === 0) {
          throw new Error('The Etihad travel calendar is not available.');
        }

        const visibleMonths: Array<{ index: number; ordinal: number }> = [];
        for (let index = 0; index < headerCount; index += 1) {
          const header = monthHeaders.nth(index);
          const headerText = (await header.innerText()).replace(/\s+/g, '');
          const match = /^([A-Za-z]{3})(\d{4})$/.exec(headerText);
          if (!match) {
            throw new Error(`Could not determine the calendar month from "${headerText}".`);
          }

          const monthNumber = MONTHS.indexOf(match[1]);
          if (monthNumber < 0) {
            throw new Error(`Unsupported calendar month "${match[1]}".`);
          }

          const ordinal = Number(match[2]) * 12 + monthNumber;
          visibleMonths.push({ index, ordinal });
          if (ordinal === monthOrdinal) {
            const indexAttribute = await header.getAttribute('data-index');
            if (indexAttribute === null || !/^\d+$/.test(indexAttribute)) {
              throw new Error('Could not determine the selected calendar month index.');
            }
            monthIndex = Number(indexAttribute);
            break;
          }
        }

        if (monthIndex >= 0) {
          break;
        }

        if (monthOrdinal < visibleMonths[0].ordinal) {
          const previousPage = this.locators.previousCalendarPageButton;
          if (!(await previousPage.isEnabled())) {
            throw new RangeError(`The Etihad calendar cannot select ${date}.`);
          }
          await this.ui.click(previousPage, 'previous calendar month');
        } else {
          const nextPage = this.locators.nextCalendarPageButton;
          if (!(await nextPage.isEnabled())) {
            throw new RangeError(`The Etihad calendar cannot select ${date}.`);
          }
          await this.ui.click(nextPage, 'next calendar month');
        }
      }

      if (monthIndex < 0) {
        throw new RangeError(`The Etihad calendar did not display ${date}.`);
      }

      const day = this.locators.calendarDay(monthIndex, date.getUTCDate());
      await day.waitFor({ state: 'visible' });
      await this.ui.click(day, `calendar day ${date.getUTCDate()}`);
    });
  }

  private async parseIsoDate(value: string): Promise<Date> {
    return this.steps.run('Parse the travel date in ISO format', async () => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new TypeError('Travel dates must use YYYY-MM-DD format.');
      }

      const date = new Date(`${value}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        throw new TypeError(`Invalid travel date: "${value}".`);
      }

      return date;
    });
  }
}
