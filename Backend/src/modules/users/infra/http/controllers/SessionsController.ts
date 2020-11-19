import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AutheticateUserService from '@modules/users/services/AutheticateUserService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response) {
    const { email, password } = request.body;

    const authenticateUserService = container.resolve(AutheticateUserService);

    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}