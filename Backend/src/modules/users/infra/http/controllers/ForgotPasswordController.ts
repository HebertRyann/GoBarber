import { Request, Response } from 'express';

import { container } from 'tsyringe';
import SendForgotEmailPassword from '@modules/users/services/SendForgotEmailPassword';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response) {
    const { email, password } = request.body;

    const sendForgotPasswordEmail = container.resolve(SendForgotEmailPassword);

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}