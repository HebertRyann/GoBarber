import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/Users';
import appError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import StorageProvider from '@shared/container/providers/storageProvider/models/StorageProvider';

interface Request {
  user_id: string;

  avatarFilename: string;
};

@injectable()
export default class UpdateUserAvatarServices {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: StorageProvider
  ) { }
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new appError('Only Autherticated user can change avatar', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.userRepository.save(user);

    return user;

  }

}