import type { Page } from '@playwright/test';
import { BaseFlow } from '../../core/base-flow';
import { FlightSearchPageMethods, type FlightSearchOutcome } from './flight-searchpagemethods';
import type { FareFamily } from './flight-searchpageLocators';

export class FlightSearchPageFlows extends BaseFlow {
  readonly methods: FlightSearchPageMethods;

  constructor(page: Page) {
    super('FlightSearchPageFlows');
    this.methods = new FlightSearchPageMethods(page);
  }

  async selectFlightAndFare(flightNumber: string, fareFamily: FareFamily): Promise<void> {
    await this.steps.run(`Select flight ${flightNumber} with the ${fareFamily} fare`, async () => {
      await this.methods.chooseFareForFlight(flightNumber, fareFamily);
    });
  }

  async reviewFareOptions(flightNumber: string): Promise<string[]> {
    return this.steps.run(`Review fare options for flight ${flightNumber}`, async () => {
      await this.methods.openFareFamilies(flightNumber);
      return this.methods.getFareFamilyNames();
    });
  }

  async reviewNextDayDepartureFareOptions(flightNumber: string): Promise<string[]> {
    return this.steps.run(`Review next-day fare options for flight ${flightNumber}`, async () => {
      await this.methods.openNextDayDepartureFareFamilies(flightNumber);
      return this.methods.getFareFamilyNames();
    });
  }

  async waitForSearchOutcome(timeout?: number): Promise<FlightSearchOutcome> {
    return this.steps.run('Wait for a flight search result', () =>
      this.methods.waitForSearchOutcome(timeout),
    );
  }

  async getFlightResultSummaries(): Promise<string[]> {
    return this.steps.run('Read the flight search result summaries', () =>
      this.methods.getFlightResultSummaries(),
    );
  }

  async getNextDayDepartureFlightSummaries(): Promise<string[]> {
    return this.steps.run('Read the next-day departure summaries', () =>
      this.methods.getNextDayDepartureFlightSummaries(),
    );
  }
}
