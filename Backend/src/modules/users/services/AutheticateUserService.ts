import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';
import Users from '@modules/users/infra/typeorm/entities/Users';
import appError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import HashProvider from '../providers/hasheProvider/models/HashProvider';


interface Request {
  email: string;

  password: string;
};

interface Response {
  user: Users;

  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider
  ) { }
  public async execute({ email, password }: Request): Promise<Response> {

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new appError("Incorrect email or password", 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new appError("incorrect email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    }
  }
}