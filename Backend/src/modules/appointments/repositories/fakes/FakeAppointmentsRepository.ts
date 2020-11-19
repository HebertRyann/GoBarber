import Appointments from '../../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRespository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import FindAllInMonthFromProviderDTO from '@modules/appointments/dtos/FindAllInMonthFromProviderDTO';
import FindAllInDayFromProviderDTO from '@modules/appointments/dtos/FindAllInDayFromProviderDTO';
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

class AppointmentsRepositories implements IAppointmentsRepository {
  private appointments: Appointments[] = [];

  public async findByDate(date: Date, provider_id: string): Promise<Appointments | undefined> {
    const findAppointments = this.appointments.find(appointment =>
      isEqual(appointment.date, date) &&
      appointment.provider_id === provider_id,
    );

    return findAppointments;

  }

  public async findAllInMonthFromProvider({ provider_id, year, month }: FindAllInMonthFromProviderDTO): Promise<Appointments[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) == year
    );

    return appointments;

  }

  public async findAllInDayFromProvider({ provider_id, year, month, day }: FindAllInDayFromProviderDTO): Promise<Appointments[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) == year
    );

    return appointments;

  }

  public async create({ date, provider_id, user_id }: ICreateAppointmentsDTO): Promise<Appointments> {
    const appointment = new Appointments();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });
    this.appointments.push(appointment);

    return appointment;

  }
}

export default AppointmentsRepositories;
