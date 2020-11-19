import 'reflect-metadata';
import AppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRespository';
import CacheProvider from 'shared/container/providers/CacheProvider/models/CacheProvider';
import Appointments from '@modules/appointments/infra/typeorm/entities/Appointments';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';


interface Request {
  provider_id: string;
  month: number;
  year: number;
  day: number;
};

@injectable()
export default class ListProvidersAppoinments {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: CacheProvider,

    @inject('AppointmentsRepositories')
    private appointmentsRepository: AppointmentsRepository
  ) { }
  public async execute({ provider_id, year, month, day }: Request): Promise<Appointments[]> {
    let appointments = await this.cacheProvider.recover<Appointments[]>(`provider-appoinments:${provider_id}-${year}-${month}:${day}`);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day
      });
      await this.cacheProvider.save(`provider-appoinments:${provider_id}:${year}-${month}-${day}`, classToClass(appointments))
    }


    return appointments;


  }
}