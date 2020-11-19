import Mailprovider from '../models/MailProvider';
import SendMailDTO from '../dtos/SendMailDTO';

export default class FakeMailProvider implements Mailprovider {
  private messages: SendMailDTO[] = [];
  public async sendMail(message: SendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}