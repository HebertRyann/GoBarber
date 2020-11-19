import AppError from '@shared/errors/AppError';
import FakeAppoinmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakesNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakesCacheProvider';
import CreateAppointmentsServices from './CreateAppoitmentsServices';

let fakeAppoinmentsRepository: FakeAppoinmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentsServices: CreateAppointmentsServices;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointments', () => {
  beforeEach(() => {
    fakeAppoinmentsRepository = new FakeAppoinmentsRepository(),
      fakeNotificationsRepository = new FakeNotificationsRepository(),
      fakeCacheProvider = new FakeCacheProvider()

    createAppointmentsServices = new CreateAppointmentsServices(
      fakeAppoinmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider);
  });
  it('shloud to be able a new Appointments', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });


    const appointment = await createAppointmentsServices.execute({
      date: new Date(2020, 4, 10, 14),
      provider_id: 'provider-id',
      user_id: 'user-id'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });
  it('not shloud to be able to create two appointments on the same date', async () => {

    const appointmenstDate = new Date(2020, 4, 10, 15);

    await createAppointmentsServices.execute({
      date: appointmenstDate,
      provider_id: 'provider-id',
      user_id: 'user-id'
    });

    await expect(createAppointmentsServices.execute({
      date: appointmenstDate,
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(AppError);

  });
  it('sholud not to be able to create an appointmet on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 13).getTime();
    });

    await expect(createAppointmentsServices.execute({
      date: new Date(2020, 4, 10, 12),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(AppError);

  });
  it('sholud not to be able to create an appointmet with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentsServices.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider-id',
      user_id: 'provider-id'
    })).rejects.toBeInstanceOf(AppError);

  });
  it('sholud not to be able to create an appointmet before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentsServices.execute({
      date: new Date(2020, 4, 11, 7),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(AppError);
    await expect(createAppointmentsServices.execute({
      date: new Date(2020, 4, 11, 18),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(AppError);

  });
});