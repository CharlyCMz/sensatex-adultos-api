import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AddiApplicationResponse,
  AddiAuthResponse,
  AddiConfigResponse,
} from './dtos/addi.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddiService {
  tokenRefreshInterval: NodeJS.Timeout;

  private authUrl: string;
  private allySlug: string;
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  //private publicUrl: string;

  private accessToken: AddiAuthResponse;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.getAddiConfig();
    this.startTokenRefreshTimer();
  }

  private getAddiConfig() {
    this.authUrl = this.configService.get('addi')?.authUrl;
    this.allySlug = this.configService.get('addi')?.allySlug;
    this.baseUrl = this.configService.get('addi')?.baseUrl;
    this.clientId = this.configService.get('addi')?.clientId;
    this.clientSecret = this.configService.get('addi')?.clientSecret;
    //this.publicUrl = this.configService.get('addi')?.publicUrl;
  }

  private async startTokenRefreshTimer() {
    await this.getAccessToken();
    let expirationTime;
    if (this.accessToken.expires_in > 86400) {
      expirationTime = 86400;
    } else {
      expirationTime = this.accessToken.expires_in;
    }
    const refreshTime = expirationTime * 1000;
    this.tokenRefreshInterval = setInterval(async () => {
      await this.getAccessToken();
    }, refreshTime);
  }

  private handleError(method: string, error: any): never {
    const message =
      error.response?.data || error.message || 'Error desconocido';
    const status = error.response?.status || 500;
    console.error(`[${method}] ${message}`);
    throw new HttpException(message, status);
  }

  async verifyAmount(requestedAmount: number): Promise<AddiConfigResponse> {
    try {
      const url = `${this.baseUrl}/allies/${this.allySlug}/config?requestedAmount=${requestedAmount}`;
      const { data } = await firstValueFrom(this.httpService.get(url));
      return data;
    } catch (error) {
      this.handleError('verifyAmount', error);
    }
  }

  async getAccessToken() {
    try {
      const payload = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: `${this.baseUrl}`,
        grant_type: 'client_credentials',
      };
      const data = await firstValueFrom(
        this.httpService.post<AddiAuthResponse>(
          `${this.authUrl}/oauth/token`,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );
      this.accessToken = data.data;
      console.log('Token ADDI obtenido correctamente', this.accessToken);
      //return this.accessToken.access_token;
    } catch (error) {
      this.handleError('getAccessToken', error);
    }
  }

  async createOnlineLoanApplication(
    payload: any,
  ): Promise<AddiApplicationResponse> {
    try {
      const url = `${this.baseUrl}/v1/online-applications`;

      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.accessToken.access_token}`,
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 400 || status === 301,
        }),
      );

      const redirectUrl = response.headers['location'];
      if (!redirectUrl) {
        throw new Error(
          'No se encontró la URL de redirección (Location header)',
        );
      }

      console.log(`Solicitud ADDI creada. Redirigir a: ${redirectUrl}`);
      return { redirectUrl };
    } catch (error) {
      this.handleError('createOnlineLoanApplication', error);
    }
  }

  async handleCallback(callbackData: any) {
    const { applicationId, status } = callbackData;

    console.log(`Callback recibido: aplicación ${applicationId} → ${status}`);

    // Actualizar el estado de la orden en BD:

    return { received: true };
  }
}
