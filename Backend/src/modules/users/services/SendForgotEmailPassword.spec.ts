import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotEmailPassword from './SendForgotEmailPassword';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let sendForgotEmailPassword: SendForgotEmailPassword;

describe('SendForgotEmailPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    sendForgotEmailPassword = new SendForgotEmailPassword(fakeUsersRepository, fakeMailProvider, fakeUsersTokensRepository);
  })

  it('should to be able to recover the password using the email', async () => {


    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'jhon doe',
      email: 'jhondoe@gmail.com',
      password: '123123'
    })

    await sendForgotEmailPassword.execute({
      email: 'jhondoe@gmail.com'
    });

    expect(sendMail).toHaveBeenCalled();
  });
  it('should to be able to recover a non-existing user password', async () => {

    await expect(
      sendForgotEmailPassword.execute({
        email: 'jhondoe@gmail.com'
      })).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {

    const generateToken = jest.spyOn(fakeUsersTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'jhon doe',
      email: 'jhondoe@gmail.com',
      password: '123123'
    })

    await sendForgotEmailPassword.execute({
      email: 'jhondoe@gmail.com'
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});