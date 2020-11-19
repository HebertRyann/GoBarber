import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/hasheProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  })
  it('should to be able update the profile', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@example.com',
      old_password: '123',
      password: '1234'
    })

    expect(updateUser.name).toBe('Jhon Tre');
    expect(updateUser.email).toBe('jhontre@example.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(updateProfileService.execute({
      user_id: 'non-existing-user',
      name: 'non-existing-user',
      email: 'non-existing-user',
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to change to another user email', async () => {

    await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhontre@example.com',
      password: '123'
    })

    const user = await fakeUsersRepository.create({
      name: 'Jhon Tre',
      email: 'jhontre@example.com',
      password: '1234'
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@example.com',
      password: '1234'
    })).rejects.toBeInstanceOf(AppError)

  });
  it('should to be able update the password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@example.com',
      old_password: '123',
      password: '1234'
    })

    expect(updateUser.password).toBe('1234');
  });
  it('should not be able update the password whitout old Password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@example.com',
      password: '1234'
    })).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able update password with the wrong old Password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@example.com',
      old_password: 'wrong-old-password',
      password: '1234'
    })).rejects.toBeInstanceOf(AppError);
  });
})