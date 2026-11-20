import type { Page } from "@playwright/test";

export type FareFamily = "Value" | "Comfort" | "Deluxe";

export class FlightSearchPageLocators {
  constructor(private readonly page: Page) {}

  get modifySearchButton() {
    return this.page.getByRole("button", { name: "Modify", exact: true });
  }

  get loginButton() {
    return this.page.getByRole("button", { name: "Log in", exact: true });
  }

  get filterSortButton() {
    return this.page.getByRole("button", { name: "Filter/Sort", exact: true });
  }

  get currencyButton() {
    return this.page.getByRole("button", {
      name: "Choose currency",
      exact: true,
    });
  }

  get showMoreFlightsButton() {
    return this.page.getByRole("button", {
      name: "Show more flights",
      exact: true,
    });
  }

  get outboundFlightHeading() {
    return this.page.getByText("Outbound flight", { exact: true });
  }

  get returnFlightHeading() {
    return this.page.getByText("Return flight", { exact: true });
  }

  get nextDayDepartureSection() {
    return this.page.getByRole("heading", { name: "Next Day Departure" });
  }

  get flightCards() {
    return this.page.locator('[id^="UpsellPremiumRow-"]');
  }

  get nextDayDepartureFlightCards() {
    return this.nextDayDepartureSection.locator('[id^="UpsellPremiumRow-"]');
  }

  get nextDayFlightsTime() {
    return this.page.locator(
      "//h3[contains(text(),'Next day departure')]/following::time[@id='departureTime']",
    );
  }

  get nextDayBusinesFlights() {
    return this.page.locator(
      "//h3[contains(@class,'next-day-flights-title')]/following::*[@data-testid='cabin:Business']",
    );
  }

  get nextDayEconomyFlights() {
    return this.page.locator(
      "//h3[contains(@class,'next-day-flights-title')]/following::*[@data-testid='cabin:Economy']",
    );
  }

  get searchLoadingIndicator() {
    return this.page
      .getByRole("progressbar")
      .or(this.page.locator('[aria-busy="true"]'))
      .first();
  }

  get noFlightsAvailableMessage() {
    return this.page.getByText(/^No Flights Available$/i);
  }

  get serviceUnavailableMessage() {
    return this.page.getByText(
      /service unavailable|temporarily unavailable|An unexpected error occurred while processing your request/i,
    );
  }

  get businessErrorMessages() {
    return this.page.getByRole("alert");
  }

  get fareCards() {
    return this.page
      .getByRole("listitem")
      .filter({ hasText: /\b(?:Value|Comfort|Deluxe)\b/ });
  }

  get flightDetailsDialog() {
    return this.page.getByRole("dialog");
  }

  get closeFlightDetailsButton() {
    return this.flightDetailsDialog.getByRole("button", {
      name: "Close",
      exact: true,
    });
  }

  flightCard(flightNumber: string) {
    return this.flightCards.filter({
      has: this.page.getByText(flightNumber, { exact: true }),
    });
  }

  nextDayDepartureFlightCard(flightNumber: string) {
    return this.nextDayDepartureFlightCards.filter({
      has: this.page.getByText(flightNumber, { exact: true }),
    });
  }

  flightDetailsButton(flightNumber: string) {
    return this.flightCard(flightNumber).getByRole("button", {
      name: "Details",
      exact: true,
    });
  }

  flightFareButton(flightNumber: string) {
    return this.flightCard(flightNumber).getByRole("button", {
      name: "View",
      exact: true,
    });
  }

  nextDayDepartureFlightDetailsButton(flightNumber: string) {
    return this.nextDayDepartureFlightCard(flightNumber).getByRole("button", {
      name: "Details",
      exact: true,
    });
  }

  nextDayDepartureFlightFareButton(flightNumber: string) {
    return this.nextDayDepartureFlightCard(flightNumber).getByRole("button", {
      name: "View",
      exact: true,
    });
  }

  fareCard(fareFamily: FareFamily) {
    return this.fareCards.filter({
      has: this.page.getByText(fareFamily, { exact: true }),
    });
  }

  fareContinueButton(fareFamily: FareFamily) {
    return this.fareCard(fareFamily).getByRole("button", { name: /Continue/ });
  }

  departureDayButton(dateLabel: string) {
    return this.page.getByRole("button", { name: new RegExp(dateLabel, "i") });
  }
}

