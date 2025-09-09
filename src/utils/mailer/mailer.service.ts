import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { Sell } from 'src/sales/entities/sell.entity';

@Injectable()
export class MailerService {
  private mailerSend: MailerSend;

  constructor(private configService: ConfigService) {
    this.mailerSend = new MailerSend({
      apiKey:
        this.configService.get<string>('sensatexAdultos.mailer.token') || '',
    });
  }

  async sendConfirmationEmail(
    name: string,
    mail: string,
    subject: string,
    sell?: Sell,
  ) {
    const sentFrom = new Sender('info@sensatexadultos.com', 'Sensatex Adultos');

    const recipients = [new Recipient(mail, name)];

    const personalization = [
      {
        email: mail,
        data: {
          name: name,
          order: {
            total: sell?.total || '',
            shipping: sell?.shippingTotal || '',
            subtotal: sell?.purchaseTotal || '',
            createdAt: sell?.createdAt || '',
            trackingCode: sell?.trackingCode || '',
            transporter: sell?.transporter || '',
            shippingAddress: sell?.shippingAddress || '',
            transporterTracking: sell?.transporterTracking || '',
          },
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setPersonalization(personalization);

    switch (subject) {
      case 'Confirmación de Compra':
        emailParams.setTemplateId('3z0vkloj20pg7qrx');
        break;
      case 'Se ha realizado una Compra':
        emailParams.setTemplateId('pq3enl6ymw0g2vwr');
        break;
      case 'Tu pedido ha sido enviado':
        emailParams.setTemplateId('3vz9dlejpz64kj50');
        break;
    }
    console.log(emailParams);
    await this.mailerSend.email.send(emailParams);

    return true;
  }
}
