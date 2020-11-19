import Appointments from '../infra/typeorm/entities/Appointments';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import FindAllInMonthFromProviderDTO from '@modules/appointments/dtos/FindAllInMonthFromProviderDTO';
import FindAllInDayFromProviderDTO from '@modules/appointments/dtos/FindAllInDayFromProviderDTO';

export default interface IAppointmestsRepository {
  findByDate(date: Date, provider_id: string): Promise<Appointments | undefined>;
  create(data: ICreateAppointmentsDTO): Promise<Appointments>;
  findAllInMonthFromProvider(data: FindAllInMonthFromProviderDTO): Promise<Appointments[]>
  findAllInDayFromProvider(data: FindAllInDayFromProviderDTO): Promise<Appointments[]>
};