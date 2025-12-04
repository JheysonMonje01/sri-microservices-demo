//src/common/email/mail.service.ts

import { Injectable, Logger } from '@nestjs/common';
import sgMail, { MailDataRequired, ClientResponse, ResponseError } from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      this.logger.error('❌ SENDGRID_API_KEY no está definido en .env');
      throw new Error('SENDGRID_API_KEY no definido');
    }

    sgMail.setApiKey(apiKey);
  }

  async enviarCorreo(destinatario: string, asunto: string, contenidoHtml: string) {
    const msg: MailDataRequired = {
      to: destinatario,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: asunto,
      html: contenidoHtml,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`📧 Correo enviado a ${destinatario}`);
      return true;

    } catch (error: unknown) {
      // ---- Tipado SEGURO para errores de SendGrid ----
      let detalle = 'Error desconocido';

      const e = error as Partial<ResponseError> & { response?: ClientResponse };

      if (e.response?.body) {
        detalle = JSON.stringify(e.response.body);
      } else if (e instanceof Error) {
        detalle = e.message;
      }

      this.logger.error(`❌ Error enviando correo: ${detalle}`);
      throw error;
    }
  }
}
