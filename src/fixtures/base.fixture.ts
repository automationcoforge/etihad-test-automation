import { test as base, expect } from '@playwright/test';
import { HomepageFlows } from '../pages/home/homepageflows';
import { FlightSearchPageFlows } from '../pages/flight-search/flight-searchpageflows';
import { ErrorPageFlows } from '../pages/error/errorpageflows';
import { GuestInfoPageFlows } from '../pages/guest-info/guest-infopageflows';
import { SeatSelectionPageFlows } from '../pages/seat-selection/seat-selectionpageflows';
import { BaggagePageFlows } from '../pages/baggage/baggagepageflows';
import { ExtrasPageFlows } from '../pages/extras/extraspageflows';
import { LoungePageFlows } from '../pages/lounge/loungepageflows';
import { PaymentPageFlows } from '../pages/payment/paymentpageflows';

type TestFixtures = {
  homepage: HomepageFlows;
  flightSearch: FlightSearchPageFlows;
  errorPage: ErrorPageFlows;
  guestInfo: GuestInfoPageFlows;
  seatSelection: SeatSelectionPageFlows;
  baggage: BaggagePageFlows;
  extras: ExtrasPageFlows;
  lounge: LoungePageFlows;
  payment: PaymentPageFlows;
};

export const test = base.extend<TestFixtures>({
  homepage: async ({ page }, use) => {
    await use(new HomepageFlows(page));
  },
  flightSearch: async ({ page }, use) => {
    await use(new FlightSearchPageFlows(page));
  },
  errorPage: async ({ page }, use) => {
    await use(new ErrorPageFlows(page));
  },
  guestInfo: async ({ page }, use) => {
    await use(new GuestInfoPageFlows(page));
  },
  seatSelection: async ({ page }, use) => {
    await use(new SeatSelectionPageFlows(page));
  },
  baggage: async ({ page }, use) => {
    await use(new BaggagePageFlows(page));
  },
  extras: async ({ page }, use) => {
    await use(new ExtrasPageFlows(page));
  },
  lounge: async ({ page }, use) => {
    await use(new LoungePageFlows(page));
  },
  payment: async ({ page }, use) => {
    await use(new PaymentPageFlows(page));
  },
});

export { expect };
