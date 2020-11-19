import { Request, Response } from 'express';
import { container } from 'tsyringe';
import createUsersServices from '@modules/users/services/CreateUsersServices';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response) {
    try {

      const { name, email, password } = request.body;

      const createUser = container.resolve(createUsersServices);

      const user = await createUser.execute({
        name,
        email,
        password,
      });
      return response.json(classToClass(user));
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}