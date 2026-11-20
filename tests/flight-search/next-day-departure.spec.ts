import { DateUtils } from "../../src/utils/date.utils";
import { test, expect } from "../../src/fixtures/base.fixture";
import { FlightSearchCriteria } from "../../src/models/flightSearchCriteria";
const searchData:FlightSearchCriteria={
    tripType: "One way",
    origin: { query: "Abu Dhabi", optionMatch: "AUH" },
    destination: { query: "London", optionMatch: "LHR" },
    departureDate: 14,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
      infantsWithSeat: 0,
    },
  }
test("shows Abu Dhabi to London next-day departures between midnight and 3 AM", async ({
  homepage,
  flightSearch,
  page,
}) => {
  const outcome = await homepage.searchForFlights(searchData);
  await flightSearch.methods.verifyFlightSearchResult(outcome);
  await flightSearch.methods.verifyNextDayDepartureSectionVisible();
  await flightSearch.methods.verifyNextDayDepartureFlightTime();
  await flightSearch.methods.selectNextDayBusinessFlights();
});
