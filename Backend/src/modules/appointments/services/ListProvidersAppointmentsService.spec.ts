import AppError from '@shared/errors/AppError';
import ListProvidersAppointmentsService from './ListProvidersAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakesCacheProvider';

let listProvidersAppointmentsService: ListProvidersAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider()
    listProvidersAppointmentsService = new ListProvidersAppointmentsService(
      fakeCacheProvider,
      fakeAppointmentsRepository
    );
  })
  it('should to be able list the appointments in secif day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointmtents = await listProvidersAppointmentsService.execute({
      provider_id: 'provider',
      month: 5,
      year: 2020,
      day: 20
    });

    expect(appointmtents).toEqual(expect.arrayContaining([
      appointment1, appointment2
    ]))

  })
})