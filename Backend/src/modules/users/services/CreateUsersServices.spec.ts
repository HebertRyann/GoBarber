import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUsersServices from './CreateUsersServices';
import FakeHashProvider from '../providers/hasheProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakesCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersServices: CreateUsersServices;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()
    createUsersServices = new CreateUsersServices(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  })
  it('should to be able a new User', async () => {

    const users = await createUsersServices.execute({
      name: 'Jhon Dow',
      email: 'jhondoe@gmail.com',
      password: '123',
    });

    expect(users).toHaveProperty('id');
  });
});

describe('CreateUser', () => {
  it('should not to be able to create a new user same email with from another', async () => {

    await createUsersServices.execute({
      name: 'Jhon Dow',
      email: 'jhondoe1@gmail.com',
      password: '123',
    });

    await expect(createUsersServices.execute({
      name: 'Jhon Dow',
      email: 'jhondoe1@gmail.com',
      password: '123',
    })).rejects.toBeInstanceOf(AppError);
  });
});