import Mailprovider from '../models/MailProvider';
import SendMailDTO from '../dtos/SendMailDTO';
import MailTemplateProvider from '../../MailTemplateProvider/models/MailTemplateProvider';
import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

@injectable()
export default class EtherealMailProvider implements Mailprovider {
  private client: Transporter;
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: MailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = transporter;
    });
  }
  public async sendMail({ to, subject, from, templateData }: SendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe Gobarber',
        address: from?.email || 'Equipe@gobarber.com.br'
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject: 'Recuperaçao de Senha',
      html: await this.mailTemplateProvider.parse(templateData),
    });
    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}