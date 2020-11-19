import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';


interface Request {
  user_id: string;
  password?: string;
};

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,
  ) { }
  public async execute({ user_id }: Request): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('user not found.')
    }

    return classToClass(user);
  }
}