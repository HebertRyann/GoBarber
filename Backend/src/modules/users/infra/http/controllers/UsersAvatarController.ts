import { Request, Response } from 'express';

import { container } from 'tsyringe';
import updateUserAvatarServices from '@modules/users/services/UpdateUserAvatarServices';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async update(request: Request, response: Response) {
    const updateUserAvatar = container.resolve(updateUserAvatarServices);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });


    return response.json(classToClass(user));
  }
}