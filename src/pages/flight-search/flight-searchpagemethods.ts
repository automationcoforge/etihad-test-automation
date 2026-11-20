import { expect, type Page } from "@playwright/test";
import { BasePage } from "../../core/base-page";
import {
  FlightSearchPageLocators,
  type FareFamily,
} from "./flight-searchpageLocators";
import { DateUtils } from "../../utils/date.utils";

export type FlightSearchOutcome =
  | { status: "results"; flightCount: number }
  | { status: "no-flights" }
  | { status: "business-error"; message: string }
  | { status: "service-error"; message: string };

export class FlightSearchPageMethods extends BasePage {
  readonly locators: FlightSearchPageLocators;

  constructor(page: Page) {
    super(page, "Flight search");
    this.locators = new FlightSearchPageLocators(page);
  }

  async openFlightDetails(flightNumber: string): Promise<void> {
    await this.steps.run(
      `Open details for flight ${flightNumber}`,
      async () => {
        await this.ui.click(
          this.locators.flightDetailsButton(flightNumber),
          `flight ${flightNumber} details`,
        );
        await this.locators.flightDetailsDialog.waitFor({ state: "visible" });
      },
    );
  }

  async openNextDayDepartureFlightDetails(flightNumber: string): Promise<void> {
    await this.steps.run(
      `Open next-day details for flight ${flightNumber}`,
      async () => {
        await this.ui.click(
          this.locators.nextDayDepartureFlightDetailsButton(flightNumber),
          `next-day flight ${flightNumber} details`,
        );
        await this.locators.flightDetailsDialog.waitFor({ state: "visible" });
      },
    );
  }

  async closeFlightDetails(): Promise<void> {
    await this.steps.run("Close the flight details dialog", async () => {
      await this.ui.click(
        this.locators.closeFlightDetailsButton,
        "close flight details",
      );
      await this.locators.flightDetailsDialog.waitFor({ state: "hidden" });
    });
  }

  async openFareFamilies(flightNumber: string): Promise<void> {
    await this.steps.run(
      `Open fare options for flight ${flightNumber}`,
      async () => {
        await this.ui.click(
          this.locators.flightFareButton(flightNumber),
          `flight ${flightNumber} fares`,
        );
        await this.locators.fareCards.first().waitFor({ state: "visible" });
      },
    );
  }

  async openNextDayDepartureFareFamilies(flightNumber: string): Promise<void> {
    await this.steps.run(
      `Open next-day fare options for flight ${flightNumber}`,
      async () => {
        await this.ui.click(
          this.locators.nextDayDepartureFlightFareButton(flightNumber),
          `next-day flight ${flightNumber} fares`,
        );
        await this.locators.fareCards.first().waitFor({ state: "visible" });
      },
    );
  }

  async selectFareFamily(fareFamily: FareFamily): Promise<void> {
    await this.steps.run(`Select the ${fareFamily} fare`, async () => {
      const continueButton = this.locators.fareContinueButton(fareFamily);
      await continueButton.waitFor({ state: "visible" });

      if (!(await continueButton.isEnabled())) {
        throw new Error(
          `${fareFamily} fare is not available for the selected flight.`,
        );
      }

      await this.ui.click(continueButton, `continue with ${fareFamily} fare`);
    });
  }

  async chooseFareForFlight(
    flightNumber: string,
    fareFamily: FareFamily,
  ): Promise<void> {
    await this.steps.run(
      `Choose the ${fareFamily} fare for flight ${flightNumber}`,
      async () => {
        await this.openFareFamilies(flightNumber);
        await this.selectFareFamily(fareFamily);
      },
    );
  }

  async showMoreFlights(): Promise<void> {
    await this.steps.run("Show more flight results", async () => {
      const button = this.locators.showMoreFlightsButton;
      await button.waitFor({ state: "visible" });
      await this.ui.click(button, "show more flights");
    });
  }

  async openFilters(): Promise<void> {
    await this.steps.run("Open flight filters and sorting", async () => {
      await this.ui.click(this.locators.filterSortButton, "flight filters");
    });
  }

  async chooseCurrency(): Promise<void> {
    await this.steps.run("Open the flight currency selector", async () => {
      await this.ui.click(this.locators.currencyButton, "currency selector");
    });
  }

  async modifySearch(): Promise<void> {
    await this.steps.run("Modify the flight search", async () => {
      await this.ui.click(this.locators.modifySearchButton, "modify search");
    });
  }

  async selectDepartureDay(dateLabel: string): Promise<void> {
    await this.steps.run(`Select departure date ${dateLabel}`, async () => {
      const dateButton = this.locators.departureDayButton(dateLabel);
      await dateButton.waitFor({ state: "visible" });

      if (!(await dateButton.isEnabled())) {
        throw new Error(`No flight is available for ${dateLabel}.`);
      }

      await this.ui.click(dateButton, `departure day ${dateLabel}`);
    });
  }

  async scrollToNextDayDepartures(): Promise<void> {
    await this.steps.run("Scroll to next-day departures", async () => {
      await this.ui.scrollIntoView(
        this.locators.nextDayDepartureSection,
        "next-day departures",
      );
    });
  }

  async selectNextDayBusinessFlights(): Promise<void> {
    await this.steps.run("Select next-day business flights", async () => {
      await this.ui.click(
        this.locators.nextDayBusinesFlights,
        "next-day business flights",
      );
    });
  }

  async getFlightCardCount(): Promise<number> {
    return this.steps.run("Count available flight results", () =>
      this.locators.flightCards.count(),
    );
  }

  async getFlightResultSummaries(): Promise<string[]> {
    return this.steps.run("Read flight result summaries", async () =>
      (await this.locators.flightCards.allInnerTexts()).map((text) =>
        text.replace(/\s+/g, " ").trim(),
      ),
    );
  }

  async getNextDayDepartureFlightSummaries(): Promise<string[]> {
    return this.steps.run("Read next-day departure summaries", async () =>
      (await this.locators.nextDayDepartureFlightCards.allInnerTexts()).map(
        (text) => text.replace(/\s+/g, " ").trim(),
      ),
    );
  }

  async getFlightSummary(flightNumber: string): Promise<string> {
    return this.steps.run(
      `Read the summary for flight ${flightNumber}`,
      async () => {
        const card = this.locators.flightCard(flightNumber);
        await card.waitFor({ state: "visible" });
        return (await card.innerText()).replace(/\s+/g, " ").trim();
      },
    );
  }

  async getFareFamilyNames(): Promise<string[]> {
    return this.steps.run("Read available fare family names", () =>
      this.locators.fareCards
        .getByText(/^(Value|Comfort|Deluxe)$/)
        .allTextContents(),
    );
  }

  async getFareSummary(fareFamily: FareFamily): Promise<string> {
    return this.steps.run(`Read the ${fareFamily} fare summary`, async () => {
      const card = this.locators.fareCard(fareFamily);
      await card.waitFor({ state: "visible" });
      return (await card.innerText()).replace(/\s+/g, " ").trim();
    });
  }

  async waitForSearchOutcome(timeout = 30_000): Promise<FlightSearchOutcome> {
    return this.steps.run(
      "Wait for a terminal flight search result",
      async () => {
        const outcomePromises: Array<Promise<FlightSearchOutcome>> = [
          this.locators.flightCards
            .first()
            .waitFor({ state: "visible", timeout })
            .then(async () => ({
              status: "results" as const,
              flightCount: await this.getFlightCardCount(),
            })),
          this.locators.noFlightsAvailableMessage
            .waitFor({ state: "visible", timeout })
            .then(() => ({ status: "no-flights" as const })),
          this.locators.serviceUnavailableMessage
            .waitFor({ state: "visible", timeout })
            .then(async () => ({
              status: "service-error" as const,
              message: (
                await this.locators.serviceUnavailableMessage.innerText()
              ).trim(),
            })),
          this.locators.businessErrorMessages
            .first()
            .waitFor({ state: "visible", timeout })
            .then(async () => {
              const message = (
                await this.locators.businessErrorMessages.first().innerText()
              ).trim();
              return /service unavailable|temporarily unavailable|unexpected error|network error/i.test(
                message,
              )
                ? { status: "service-error" as const, message }
                : { status: "business-error" as const, message };
            }),
        ];

        try {
          return await Promise.any(outcomePromises);
        } catch (error) {
          if (error instanceof AggregateError) {
            throw new Error(
              "Flight search did not reach a terminal outcome before the timeout.",
              {
                cause: error,
              },
            );
          }
          throw error;
        }
      },
    );
  }

  async verifyNextDayDepartureFlightTime(): Promise<void> {
    await this.steps.run(
      "Verify next-day departure times are between 00:00 and 03:00",
      async () => {
        const flights = await this.locators.nextDayFlightsTime.count();
        for (let index = 0; index < flights; index++) {
          const departureTime = (
            await this.locators.nextDayFlightsTime.nth(index).textContent()
          )?.trim();
          if (!departureTime) {
            throw new Error(
              "Could not read the next-day flight departure time.",
            );
          }
          const totalMinutes = await DateUtils.getTimeInMinutes(departureTime);
          const startMinutes = 0; // 00:00
          const endMinutes = 3 * 60;
          expect(totalMinutes).toBeGreaterThanOrEqual(startMinutes);
          expect(totalMinutes).toBeLessThanOrEqual(endMinutes);
        }
      },
    );
  }

  async verifyFlightSearchResult(outcome: FlightSearchOutcome) {
    await this.steps.run("Verify Flight Search Results Displayed", async () => {
      expect(outcome.status).toBe("results");
    });
  }

  async verifyNextDayDepartureSectionVisible() {
    await this.steps.run(
      "Verify Next Day Departure Section Visible",
      async () => {
        await this.scrollToNextDayDepartures();
        await expect(this.locators.nextDayDepartureSection).toBeVisible();
      },
    );
  }
}

