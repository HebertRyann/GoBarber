import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProviderService';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
  public async index(request: Request, response: Response) {
    const user_id = request.user.id;

    const listProviderService = container.resolve(ListProvidersService);

    const providers = await listProviderService.execute({
      user_id,
    });

    return response.json(classToClass(providers));
  }
}