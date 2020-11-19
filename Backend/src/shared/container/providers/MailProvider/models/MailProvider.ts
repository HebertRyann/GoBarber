import SendMailDTO from '../dtos/SendMailDTO';

export default interface MailPRovider {
  sendMail(data: SendMailDTO): Promise<void>;
}