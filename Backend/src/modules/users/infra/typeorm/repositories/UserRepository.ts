import User from '../entities/Users';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import FindAllProviders from '@modules/users/dtos/FindAllProvidersDTO';
import { getRepository, Not, Repository } from 'typeorm';
import Users from '../entities/Users';

class UsersRepositories implements IUsersRepository {
  private ormRepository: Repository<Users>;
  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne(id);
    return user;

  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { email }
    });
    return user;

  }

  public async findAllProviders({ except_user_id }: FindAllProviders): Promise<Users[]> {
    let users: Users[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        }
      })
    } else {
      users = await this.ormRepository.find();
    }

    return users;

  }

  public async create(UserData: ICreateUserDTO): Promise<Users> {
    const user = this.ormRepository.create(UserData);
    await this.ormRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);

  }


}

export default UsersRepositories;
