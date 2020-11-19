import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hasheProvider/fakes/FakeHashProvider';
import AutheticateUserService from './AutheticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUsers: AutheticateUserService;

describe('AuthenticatedUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider();
    authenticateUsers = new AutheticateUserService(fakeUsersRepository, fakeHashProvider);

  })
  it('should to be able to authenticate', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Dow',
      email: 'jhondoes@gmail.com',
      password: '123123'
    })

    const response = await authenticateUsers.execute({
      email: 'jhondoes@gmail.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate whith non existing user', async () => {

    const authenticateUsers = new AutheticateUserService(fakeUsersRepository, fakeHashProvider)

    await expect(authenticateUsers.execute({
      email: 'jhondoes@gmail.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to authenticate  whit wrong password', async () => {

    await fakeUsersRepository.create({
      name: 'Jhon Dow',
      email: 'jhondoes@gmail.com',
      password: '123123'
    })


    await expect(authenticateUsers.execute({
      email: 'jhondoes@gmail.com',
      password: '123',
    })).rejects.toBeInstanceOf(AppError);
  });
});