export interface PropertyInfo {
  type: string;
  address: {
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface ApplicationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  proposedOccupants: number;
  dob: string;
  leaseLength: string;
  occupation: string;
  
  // Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Questionnaire
  hasPets: boolean;
  worksAtNight: boolean;
  smokes: boolean;
  isFelon: boolean;
  isSection8: boolean;
  everConvicted: boolean;
  
  // Financial
  rent: number;
  securityDeposit: number;
  appFee: number;
  appFeeMethod: string;
  petFee: number;
  
  // Property Info
  properties: PropertyInfo[];
  
  // Quick Question
  downPaymentAmount: string;
}
