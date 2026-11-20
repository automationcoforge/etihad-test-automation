import type { TripType } from '../pages/home/homepageLocators';

export type FlightSearchTripType = TripType;
export type PassengerCategory = 'Adults' | 'Children' | 'Infants' | 'Infants with Seat' | 'Young Adults';
export type CabinClass = 'Economy' | 'Business' | 'First';

export interface AirportSelection {
  query: string;
  optionMatch?: string;
  airportCode?: string;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
  infantsWithSeat: number;
  youngAdults?: number;
}

export interface FlightSearchBaseCriteria {
  passengers: PassengerCounts;
  cabin?: CabinClass;
}

export interface FlightSearchLeg {
  origin: AirportSelection;
  destination: AirportSelection;
  departureDate: number;
}

export interface OneWayFlightSearchCriteria extends FlightSearchBaseCriteria {
  tripType: 'One way';
  origin: AirportSelection;
  destination: AirportSelection;
  departureDate: number;
}

export interface RoundTripFlightSearchCriteria extends FlightSearchBaseCriteria {
  tripType: 'Round trip';
  origin: AirportSelection;
  destination: AirportSelection;
  departureDate: number;
  returnDate?: number;
}

export interface MultiCityFlightSearchCriteria extends FlightSearchBaseCriteria {
  tripType: 'Multi-city';
  segments: FlightSearchLeg[];
}

export type FlightSearchCriteria =
  | OneWayFlightSearchCriteria
  | RoundTripFlightSearchCriteria
  | MultiCityFlightSearchCriteria;
