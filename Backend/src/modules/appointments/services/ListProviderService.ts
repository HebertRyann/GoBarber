import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import CacheProvider from 'shared/container/providers/CacheProvider/models/CacheProvider';
import User from '@modules/users/infra/typeorm/entities/Users';
import { classToClass } from 'class-transformer';


interface Request {
  user_id: string;
};

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) { }
  public async execute({ user_id }: Request): Promise<User[]> {


    let users = await this.cacheProvider.recover<User[]>(`provider-list:${user_id}`);


    if (!users) {
      users = await this.userRepository.findAllProviders({
        except_user_id: user_id,
      });
    }

    await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users))

    return users;
  }
}