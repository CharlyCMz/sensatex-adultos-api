import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { Sell } from 'src/sales/entities/sell.entity';

@Injectable()
export class MailerService {
  private mailerSend: MailerSend;

  constructor(private configService: ConfigService) {
    // this.transporter = nodemailer.createTransport({
    //   host: this.configService.get<string>('sensatexAdultos.mailer.host'),
    //   port: this.configService.get<number>('sensatexAdultos.mailer.port'),
    //   secure: false,
    //   auth: {
    //     user: this.configService.get<string>('sensatexAdultos.mailer.user'),
    //     pass: this.configService.get<string>('sensatexAdultos.mailer.pass'),
    //   },
    // });

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
            trackingCode: sell?.trackingCode || '',
          },
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setTemplateId('3z0vkloj20pg7qrx')
      .setPersonalization(personalization);

    await this.mailerSend.email.send(emailParams);

    return true;
  }
}
