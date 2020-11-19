import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';
import { classToClass } from 'class-transformer';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, year, month } = request.query;

    const listProviderApporintment = container.resolve(ListProvidersAppointmentsService);

    const appointments = await listProviderApporintment.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
      day: Number(day),
    });

    return response.json(classToClass(appointments));
  }
}