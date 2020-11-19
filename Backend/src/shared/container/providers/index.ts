import { container } from 'tsyringe';

import DiskStorageProvider from '../providers/storageProvider/implementations/DiskStorageProvider';
import StorageProvider from '../providers/storageProvider/models/StorageProvider';

import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import MailProvider from './MailProvider/models/MailProvider';


import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import MailTemplateProvider from './MailTemplateProvider/models/MailTemplateProvider';

container.registerSingleton<StorageProvider>('StorageProvider', DiskStorageProvider);

container.registerSingleton<MailTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);

container.registerInstance<MailProvider>('MailProvider', container.resolve(EtherealMailProvider));
