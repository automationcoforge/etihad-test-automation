# Etihad Playwright Automation

TypeScript end-to-end test framework for the Etihad Airways stage site. It uses
Playwright Test, accessible selectors, isolated browser contexts, reusable test
fixtures, and a three-file page-object structure.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```powershell
npm install
npx playwright install
Copy-Item .env.example .env
```

`BASE_URL` defaults to `https://test.etihad.com/en-ae/`. Set it in the
environment to test a different deployment. The optional `MOD_HEADER_VALUE`
sets the `was-secret` request header; keep its value in your ignored local
`.env` file and do not commit it.

## Run tests

```powershell
npm test
npm run test:smoke
npm run test:headed
npm run test:ui
```

The default test run covers Chromium, Firefox, and WebKit. Install browser
binaries with `npx playwright install`; on Linux CI, use
`npx playwright install --with-deps`.

On CI (`CI=true`), the suite retries failures twice, limits parallel workers,
and fails if a focused `.only` test is committed. Traces, screenshots, and
videos are retained for failed tests. The HTML report is written to
`playwright-report/` and per-test artifacts to `test-results/`.

## Page-object structure

Each page model has three files in `src/pages/<page-name>/`:

- `<page-name>pageLocators.ts` — selectors and locator types
- `<page-name>pagemethods.ts` — single-page interactions
- `<page-name>pageflows.ts` — user journeys composed from page methods

Generate a starter set for another page:

```powershell
npm run generate:page -- manage-booking
```

The generator refuses to overwrite existing files.

The homepage, flight-search results, guest information, seat selection,
baggage, extras, lounge access, payment, and booking error pages have page
models. The payment model can fill card fields and check readiness, but does
not submit payment. Tests live in `tests/`; shared Playwright fixtures live in
`src/fixtures/`, and common utilities live in `src/utils/`. Page methods extend
`BasePage`; flow objects extend `BaseFlow`. Each page-method and flow method
defines a descriptive `this.steps.run('Step description', async () => ...)`
step, and `UIActions` records browser actions as nested steps with timestamped
success and failure logs. Add site journeys through a flow class and expose
them using `src/fixtures/base.fixture.ts`.

## Booking search

`HomepageFlows.searchForFlights()` accepts typed one-way, round-trip, and
multi-city criteria. A multi-city search provides an ordered array of at least
two flight segments, each with origin, destination, and departure date. The
flow reuses homepage methods to choose airport suggestions, set passenger
counters, select a cabin, pick calendar dates, and start the search.
`FlightSearchPageFlows` exposes reusable flight-details,
fare-family, filtering, currency, and show-more actions. Occupied seats are
limited to nine; adults, children, young adults, and infants with a seat use
seats, while lap infants do not. Combined infant counts cannot exceed adults.
Unsupported passenger requests fail validation before the site is opened.
Passenger configuration methods expose the selected cabin and guest/cabin
summary, and verify that selecting a cabin leaves only one cabin selected.
Search criteria may omit `cabin`; the flow then selects Economy.

`searchForFlights()` now waits for a terminal search outcome and returns either
available flight cards, no availability, a business validation error, or a
service error. `FlightSearchPageMethods` exposes the accessible loading
indicator and normalized card summaries for result assertions. The current PPE
search widget does not expose a promo-code field, so promo-code validation needs
an application control/service contract before it can be covered end to end.

Airport selection accepts airport codes, airport names, or city names and
selects from the live suggestion list. The homepage model exposes suggestion
and popular-destination retrieval, rejects disabled airport options, and
validates that each origin differs from its destination. Nearby-airport
headings can be detected, but country-specific recommendations are configured
outside this automation project and cannot be verified without the site's
business/CMS configuration. The search widget is covered for Round trip,
One-way, and Multi-city journeys across desktop, tablet, and mobile layouts.
Flight results expose a `Next Day Departure` region for grouped flights; the
results page model can read its flight summaries and open their details and
fare options. These tests cover the expected results-page structure, but the
airline site's grouping logic is outside this automation project.

```ts
await homepage.searchForFlights({
  tripType: 'Round trip',
  origin: { query: 'Abu Dhabi' },
  destination: { query: 'London', optionMatch: 'London All Airports LON' },
  departureDate: '2026-12-09',
  returnDate: '2026-12-13',
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
    infantsWithSeat: 0,
  },
  cabin: 'Business',
});
```

```ts
await homepage.searchForFlights({
  tripType: 'Multi-city',
  segments: [
    {
      origin: { query: 'Kolkata' },
      destination: { query: 'Abu Dhabi' },
      departureDate: '2026-12-15',
    },
    {
      origin: { query: 'Abu Dhabi' },
      destination: { query: 'London', optionMatch: 'London All Airports LON' },
      departureDate: '2026-12-18',
    },
    {
      origin: { query: 'London', optionMatch: 'Heathrow Airport' },
      destination: { query: 'Abu Dhabi' },
      departureDate: '2026-12-20',
    },
  ],
  passengers: { adults: 2, children: 1, infants: 0, infantsWithSeat: 0 },
  cabin: 'Business',
});
```
