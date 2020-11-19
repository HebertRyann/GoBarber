import Users from '@modules/users/infra/typeorm/entities/Users';
import appError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import HashProvider from '../providers/hasheProvider/models/HashProvider';
import CacheProvider from 'shared/container/providers/CacheProvider/models/CacheProvider';


interface Request {

  name: string;

  email: string;

  password: string;
}
@injectable()
export default class CreateUsersServices {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) { }
  public async execute({ name, email, password }: Request): Promise<Users> {

    const checkUserExist = await this.userRepository.findByEmail(email);

    const hashedPassword = await this.hashProvider.generateHash(password);

    if (checkUserExist) {
      throw new appError('This Emails already used')
    };

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list:*')

    return user;
  }
}