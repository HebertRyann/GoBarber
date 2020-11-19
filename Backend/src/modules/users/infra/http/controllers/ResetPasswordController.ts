import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ResetPasswordService from '@modules/users/services/ResetPasswordservice';

export default class ResetPasswordController {
  public async create(request: Request, response: Response) {
    const { token, password } = request.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute({
      token,
      password
    });

    return response.status(204).json();
  }
}