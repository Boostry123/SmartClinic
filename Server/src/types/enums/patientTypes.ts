export interface patientTypes {
  PATIENT_ID: string;
  USER_ID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  DATE_OF_BIRTH: string;
  GENDER: string;
  NATIONAL_ID: string;
  PHONE_NUMBER: string;
  ADDRESS: string;
  BLOOD_TYPE: string;
  EMERGENCY_CONTACT: string;
  EMERGENCY_CONTACT_PHONE: string;
  INSURANCE_PROVIDER: string;
  INSURANCE_POLICY_NUMBER: string;
}
export interface patientFilterTypes {
  PATIENT_ID?: string;
  USER_ID?: string;
  NATIONAL_ID?: string;
  FIRST_NAME?: string;
  LAST_NAME?: string;
  PHONE_NUMBER?: string;
}
