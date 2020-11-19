import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/hasheProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordservice';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUsersTokensRepository, fakeHashProvider);
  })

  it('should to be able to reset the password', async () => {


    const user = await fakeUsersRepository.create({
      name: 'jhon doe',
      email: 'jhondoe@gmail.com',
      password: '123123'
    })

    const { token } = await fakeUsersTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPasswordService.execute({
      password: '123123123',
      token,
    });

    const updateUser = await fakeUsersRepository.findById(user.id);


    expect(generateHash).toBeCalledWith('123123123')
    expect(updateUser?.password).toBe('123123123');
  });

  it('should to be able to reset the password with non-exist token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should to be able to reset the password with non-exist user', async () => {

    const { token } = await fakeUsersTokensRepository.generate('non-existing-user');

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should to be able to reset the password if passed more then 2 hours', async () => {


    const user = await fakeUsersRepository.create({
      name: 'jhon doe',
      email: 'jhondoe@gmail.com',
      password: '123123'
    })

    const { token } = await fakeUsersTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(resetPasswordService.execute({
      password: '123123123',
      token,
    })).rejects.toBeInstanceOf(AppError)
  });

});