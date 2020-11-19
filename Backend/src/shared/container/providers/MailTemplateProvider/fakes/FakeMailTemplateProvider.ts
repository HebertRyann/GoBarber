import MailTemplateProvider from '../models/MailTemplateProvider';

export default class FakeMailTemplateProvider implements MailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail Content';
  }
}