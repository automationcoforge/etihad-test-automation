import type {
  AirportSelection,
  FlightSearchCriteria,
  PassengerCounts,
} from '../models/flightSearchCriteria';

function getAirportCode(airport: AirportSelection): string | undefined {
  if (airport.airportCode?.trim()) {
    return airport.airportCode.trim().toLocaleUpperCase();
  }

  for (const value of [airport.optionMatch, airport.query]) {
    if (!value) {
      continue;
    }

    const trimmedValue = value.trim();
    if (/^[A-Za-z]{3}$/.test(trimmedValue)) {
      return trimmedValue.toLocaleUpperCase();
    }

    const match = /\b([A-Z]{3})\b/.exec(trimmedValue);
    if (match) {
      return match[1].toLocaleUpperCase();
    }
  }

  return undefined;
}

function normalizeAirportValue(value: string): string {
  return value.trim().replace(/[,.]/g, '').replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function areSameAirport(origin: AirportSelection, destination: AirportSelection): boolean {
  const originCode = getAirportCode(origin);
  const destinationCode = getAirportCode(destination);
  if (originCode && destinationCode) {
    return originCode === destinationCode;
  }

  return (
    normalizeAirportValue(origin.optionMatch ?? origin.query) ===
    normalizeAirportValue(destination.optionMatch ?? destination.query)
  );
}

export function validateDifferentAirports(
  origin: AirportSelection,
  destination: AirportSelection,
): void {
  if (areSameAirport(origin, destination)) {
    throw new RangeError('Origin and destination must be different airports.');
  }
}

export function getTotalPassengers(passengers: PassengerCounts): number {
  return (
    passengers.adults +
    passengers.children +
    passengers.infants +
    passengers.infantsWithSeat +
    (passengers.youngAdults ?? 0)
  );
}

export function getOccupiedSeats(passengers: PassengerCounts): number {
  return (
    passengers.adults +
    passengers.children +
    passengers.infantsWithSeat +
    (passengers.youngAdults ?? 0)
  );
}

export function validatePassengerCounts(passengers: PassengerCounts): void {
  const counts = [
    passengers.adults,
    passengers.children,
    passengers.infants,
    passengers.infantsWithSeat,
    passengers.youngAdults ?? 0,
  ];

  if (counts.some((count) => !Number.isInteger(count) || count < 0)) {
    throw new TypeError('Passenger counts must be non-negative integers.');
  }

  if (passengers.adults < 1) {
    throw new RangeError('At least one adult is required.');
  }

  if (passengers.infants + passengers.infantsWithSeat > passengers.adults) {
    throw new RangeError('The selected infant count exceeds the number of adults.');
  }

  if (getOccupiedSeats(passengers) > 9) {
    throw new RangeError('Etihad flight search supports at most 9 occupied seats.');
  }
}



export function validateFlightSearchCriteria(criteria: FlightSearchCriteria): void {
  validatePassengerCounts(criteria.passengers);

  if (criteria.tripType === 'Multi-city') {
    if (criteria.segments.length < 2) {
      throw new RangeError('A multi-city search requires at least two flight segments.');
    }
    return;
  }

  if (!criteria.origin.query.trim() || !criteria.destination.query.trim()) {
    throw new TypeError('Origin and destination are required.');
  }
  validateDifferentAirports(criteria.origin, criteria.destination);


  if (criteria.tripType === 'Round trip') {
    if (!criteria.returnDate) {
      throw new TypeError('returnDate is required for a round trip.');
    }
  }
}
