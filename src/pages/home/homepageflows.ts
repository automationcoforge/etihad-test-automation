import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import type { FlightSearchCriteria } from '../../models/flightSearchCriteria';
import {
  validateDifferentAirports,
  validateFlightSearchCriteria,
} from '../../utils/flightSearch.utils';
import type { FlightSearchOutcome } from '../flight-search/flight-searchpagemethods';
import { FlightSearchPageFlows } from '../flight-search/flight-searchpageflows';
import { HomepageMethods } from './homepagemethods';
import type { TripType } from './homepageLocators';

export class HomepageFlows extends BaseFlow {
  readonly methods: HomepageMethods;
  private readonly flightSearch: FlightSearchPageFlows;

  constructor(page: Page) {
    super('HomepageFlows');
    this.methods = new HomepageMethods(page);
    this.flightSearch = new FlightSearchPageFlows(page);
  }

  async openHomepage(): Promise<void> {
    await this.steps.run('Open the Etihad homepage', async () => {
      await this.methods.open();
      await this.methods.dismissCookieDialogIfVisible();
    });
  }

  async openApplication(): Promise<void> {
    await this.steps.run('Open the Etihad application', async () => {
      await this.methods.open();
      await this.methods.dismissCookieDialogIfVisible();
    });
  }

  async chooseTripType(type: TripType): Promise<boolean> {
    return this.steps.run(`Choose the ${type} trip type`, async () => {
      await this.methods.selectTripType(type);
      return this.methods.isTripTypeSelected(type);
    });
  }

  async searchForFlights(criteria: FlightSearchCriteria): Promise<FlightSearchOutcome> {
    return this.steps.run('Search for flights with the selected trip details', async () => {
      validateFlightSearchCriteria(criteria);
      const cabin = criteria.cabin ?? 'Economy';
      await this.openHomepage();
      await this.methods.selectTripType(criteria.tripType);
      if (criteria.tripType === 'Multi-city') {
        await this.methods.selectMultiCitySegments(criteria.segments);
      } else {
        const origin = await this.methods.selectOrigin(
          criteria.origin.query,
          criteria.origin.optionMatch,
        );
        const destination = await this.methods.selectDestination(
          criteria.destination.query,
          criteria.destination.optionMatch,
        );
        validateDifferentAirports({ query: origin }, { query: destination });
      }
      await this.methods.openPassengerAndCabinPanel();
      await this.methods.setPassengerCounts(criteria.passengers);
      await this.methods.selectCabin(cabin);
      await this.methods.applyPassengerAndCabinSelection();
      await this.methods.assertGuestCabinSummary(criteria.passengers, cabin);
      if (criteria.tripType !== 'Multi-city') {
        await this.methods.selectTravelDates(
          criteria.departureDate,
          criteria.tripType === 'Round trip' ? criteria.returnDate : undefined,
        );
      }
      await this.methods.searchFlights();
      return this.flightSearch.waitForSearchOutcome();
      
    });
  }
}
