import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';
import IUsersRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import path from 'path';

interface Request {

  email: string;

}
@injectable()
export default class SendEmailForgotPassword {
  constructor(
    @inject('UsersRepositories')
    private userRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: MailProvider,

    @inject('UsersTokensRepositories')
    private userTokesnRepository: IUserTokensRepository,
  ) { }
  public async execute({ email }: Request): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('This User does Not Exists')
    }
    const { token } = await this.userTokesnRepository.generate(user.id);

    const forgotPasswordTempalte = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[GoBarber] Recuperaçao de senha',
      templateData: {
        file: forgotPasswordTempalte,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },

    })
  }
}