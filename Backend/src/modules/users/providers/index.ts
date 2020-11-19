import { container } from 'tsyringe';
import HashProvider from '../providers/hasheProvider/models/HashProvider';
import BcryptHashProvider from '../providers/hasheProvider/implementations/BcryptHashedProvider';

container.registerSingleton<HashProvider>(
  'HashProvider', BcryptHashProvider
)