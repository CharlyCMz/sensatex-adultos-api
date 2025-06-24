import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { MpPreferenceData } from './dtos/mp-order.dto';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';

@Injectable()
export class MercadopagoService {
  private mpClient: MercadoPagoConfig;
  private mpPreference: Preference;
  private mpPayment: Payment;

  constructor(private configService: ConfigService) {
    this.mpClient = new MercadoPagoConfig({
      accessToken: this.configService.get('mercadopago')?.accessToken,
      options: { timeout: 5000 },
    });
  }

  async createOrder(preferenceData: MpPreferenceData): Promise<string> {
    this.mpPreference = new Preference(this.mpClient);
    try {
      const PreferenceResponse: PreferenceResponse =
        await this.mpPreference.create({ body: preferenceData });
      if (
        PreferenceResponse &&
        PreferenceResponse.init_point &&
        PreferenceResponse.init_point.length > 0
      ) {
        return PreferenceResponse.init_point;
      }
      throw new Error('Mercado Pago order init_point is missing');
    } catch (error) {
      console.error('Error creating Mercado Pago order:', error);
      throw new Error('Failed to create Mercado Pago order');
    }
  }

  async webhookPayment(paymentId: string) {
    this.mpPayment = new Payment(this.mpClient);
    try {
      const response: PaymentResponse = await this.mpPayment.get({ id: paymentId });
      return {
        paymentId: response.id,
        status: response.status,
      };
    } catch (error) {
      console.error('Error processing Mercado Pago webhook payment:', error);
      throw new Error('Failed to process Mercado Pago webhook payment');
    }
  }
}
