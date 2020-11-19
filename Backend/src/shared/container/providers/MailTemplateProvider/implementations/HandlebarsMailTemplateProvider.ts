import MailTemplateProvider from '../models/MailTemplateProvider';
import ParseMailTemplateDTO from '../dtos/ParseMailTemplateDTO';
import handlebars from 'handlebars';
import fs from 'fs';

export default class HandlebarsMailTemplateProvider implements MailTemplateProvider {
  public async parse({ file, variables }: ParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parsedTemplate = handlebars.compile(templateFileContent);

    return parsedTemplate(variables);
  }
}