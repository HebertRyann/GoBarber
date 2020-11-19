import 'reflect-metadata';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRespository';
import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';


interface Request {
  provider_id: string;
  month: number;
  year: number;
};

type Response = Array<{
  day: number;
  availability: boolean;
}>

@injectable()
export default class ListProvidersMothAvailability {
  constructor(
    @inject('AppointmentsRepositories')
    private appointmentsRepository: IAppointmentsRepository
  ) { }
  public async execute({ provider_id, year, month }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      month,
      year,
    })

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from({ length: numberOfDaysInMonth }, (_, index) => index + 1);

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59)
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        availability: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });
    return availability;


  }
}