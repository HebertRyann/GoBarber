import { isBefore, startOfHour, getHours, format } from 'date-fns';
import Appointment from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/IAppointmentsRespository';
import INotificationsRepository from '@modules/notifications/repositories/NotificationsRepository';
import CacheProvider from 'shared/container/providers/CacheProvider/models/CacheProvider';
import appError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
export default class CreateAppointmentsService {
  constructor(
    @inject('AppointmentsRepositories')
    private appointmentsRepositories: IAppointmentsRepository,

    @inject('NotificationsRepositories')
    private notificationsRepositories: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) { }
  public async execute({ provider_id, date, user_id }: Request): Promise<Appointment> {

    const appointmentDate = startOfHour(date);
    const findAppointmentInSameDate = await this.appointmentsRepositories.findByDate(
      appointmentDate,
      provider_id,
    );

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointemnt on a past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }


    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepositories.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepositories.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(`provider-appoinments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`);

    return appointment;
  }
}
