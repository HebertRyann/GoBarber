import Users from '../../infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import FindAllProviders from '@modules/users/dtos/FindAllProvidersDTO';
import { uuid } from 'uuidv4';

class FakeUsersRepositories implements IUsersRepository {
  private users: Users[] = [];

  public async findById(id: string): Promise<Users | undefined> {
    const userFindId = this.users.find(user => user.id === id);

    return userFindId;
  }

  public async findByEmail(email: string): Promise<Users | undefined> {
    const userFindId = this.users.find(user => user.email === email);

    return userFindId;

  }
  public async findAllProviders({ except_user_id }: FindAllProviders): Promise<Users[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id)
    }

    return users;

  }

  public async create(UserData: ICreateUserDTO): Promise<Users> {
    const user = new Users();

    Object.assign(user, { id: uuid() }, UserData)
    this.users.push(user);

    return user;
  }

  public async save(user: Users): Promise<Users> {
    const findUserIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findUserIndex] = user;

    return user;
  }
}

export default FakeUsersRepositories;
