import 'reflect-metadata';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRespository';
import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, getHours, isAfter } from 'date-fns';


interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
};

type Response = Array<{
  hour: number;
  availability: boolean;
}>

@injectable()
export default class ListProvidersDayAvailability {
  constructor(
    @inject('AppointmentsRepositories')
    private appointmentsRepository: IAppointmentsRepository
  ) { }
  public async execute({ provider_id, year, month, day }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      month,
      year,
      day,
    });

    // const hourStart = 8;

    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + 8);

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment =>
        getHours(appointment.date) === hour);

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        availability: !hasAppointmentInHour && isAfter(compareDate, currentDate)
      }
    })

    return availability;
  };
};