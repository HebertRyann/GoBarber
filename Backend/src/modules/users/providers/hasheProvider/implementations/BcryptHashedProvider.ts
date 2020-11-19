import { de } from 'date-fns/locale';
import HashedProvider from '../models/HashProvider';
import { hash, compare } from 'bcryptjs';

export default class BcryptHashProvider implements HashedProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);

  }
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);

  }
};