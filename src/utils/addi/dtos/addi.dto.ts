export interface AddiConfigResponse {
  minAmount: number;
  maxAmount: number;
  policy: {
    discount: number;
    productType: string;
  };
}

export interface AddiAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AddiApplicationResponse {
  redirectUrl: string;
}

export type AddiCallbackStatus = 'APPROVED' | 'REJECTED' | 'DECLINED' | 'ABANDONED';

export interface AddiCallbackResponse {
  orderId: string;
  applicationId: string;
  approvedAmount: string;
  currency?: string;
  status: string;
  statusTimestamp?: string;
}

export class AddiItem {
  sku: string;
  name: string;
  quantity: string;
  unitPrice: number;
  tax?: number;
  pictureUrl?: string;
  category?: string;
  brand?: string;
}

export class AddiAddress {
  lineOne: string;
  city: string;
  country: string;
}

export class AddiClient {
  idType: string;
  idNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  cellphone: string;
  cellphoneCountryCode: string;
  address: AddiAddress;
}

export class AddiRedirection {
  logoUrl: string;
  callbackUrl: string;
  redirectionUrl: string;
}

export class AddiPreferenceData {
  orderId: string;
  totalAmount: string;
  shippingAmount: number;
  totalTaxesAmount?: number;
  currency: string;
  items: AddiItem[];
  client: AddiClient;
  shippingAddress?: AddiAddress;
  billingAddress?: AddiAddress;
  pickUpAddress?: AddiAddress;
  allyUrlRedirection: AddiRedirection;
}




