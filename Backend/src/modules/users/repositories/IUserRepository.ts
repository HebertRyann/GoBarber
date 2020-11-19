import User from '../infra/typeorm/entities/Users';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import findAllProviders from '../dtos/FindAllProvidersDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAllProviders(data: findAllProviders): Promise<User[]>;
  create(data: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>;
}