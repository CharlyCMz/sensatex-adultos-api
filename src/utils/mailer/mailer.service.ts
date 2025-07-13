import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('sensatexAdultos.mailer.host'),
      port: this.configService.get<number>('sensatexAdultos.mailer.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('sensatexAdultos.mailer.user'),
        pass: this.configService.get<string>('sensatexAdultos.mailer.pass'),
      },
    });
  }

  async sendConfirmationEmail(
    to: string,
    orderId: string,
    total: string,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('sensatexAdultos.mailer.from'),
      to,
      subject: 'Confirmación de tu compra',
      html: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Hemos recibido tu pedido exitosamente.</p>
        <p><strong>ID del pedido:</strong> ${orderId}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p>Pronto recibirás un correo con el estado del envío.</p>
        <br/>
        <p>Saludos,</p>
        <p><em>El equipo de Tu Tienda</em></p>
      `,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
