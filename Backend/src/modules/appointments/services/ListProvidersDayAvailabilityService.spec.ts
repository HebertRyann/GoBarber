import AppError from '@shared/errors/AppError';
import ListProviderDayAvailability from './ListProvidersDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';


let listProviderDaAvailability: ListProviderDayAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDaAvailability = new ListProviderDayAvailability(
      fakeAppointmentsRepository,
    );
  })
  it('should to be able list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 11).getTime();
    })

    const availability = await listProviderDaAvailability.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
      day: 20,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 8, availability: false },
      { hour: 9, availability: false },
      { hour: 10, availability: false },
      { hour: 12, availability: true },
      { hour: 13, availability: false },
      { hour: 14, availability: false },
      { hour: 16, availability: true },
    ]))

  })
})