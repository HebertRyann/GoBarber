import IUsersRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import HashProvider from '../providers/hasheProvider/models/HashProvider';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';

interface Request {

  token: string;

  password: string;

}
@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('UsersTokensRepositories')
    private userTokesnRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) { }
  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokesnRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exist')
    }
    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exist')
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('token expired')
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);

  }
}