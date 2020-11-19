import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import HashProvider from '../providers/hasheProvider/models/HashProvider';

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
};

@injectable()
export default class UpdateProfileServices {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider
  ) { }
  public async execute({ user_id, name, email, password, old_password }: Request): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('user not found.')
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }
    user.name = name;
    user.email = email;


    if (password && !old_password) {
      throw new AppError('you need inform old password to set a new password')
    }
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('old password dows not match')
      }
      user.password = await this.hashProvider.generateHash(password);
    }


    return this.userRepository.save(user);
  }
}