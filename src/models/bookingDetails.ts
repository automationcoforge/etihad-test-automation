export type GuestTitle =
  | 'Mr'
  | 'Mrs'
  | 'Ms'
  | 'Miss'
  | 'He'
  | 'HH'
  | 'HRH'
  | 'Dr'
  | 'N/A'
  | 'Prof'
  | 'Sheikh'
  | 'Sheikha'
  | 'Sir';
export type GuestGender = 'Male' | 'Female';

export interface TravelerDetails {
  firstName: string;
  lastName: string;
  title?: GuestTitle;
  dateOfBirth?: string;
  gender?: GuestGender;
}

export interface GuestContactDetails {
  primaryGuest: string;
  dialCode: string;
  phoneNumber: string;
  email: string;
}

export interface PaymentCardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  securityCode: string;
  billingCountry?: string;
}
