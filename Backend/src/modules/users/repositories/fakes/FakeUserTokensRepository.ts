import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokens from '@modules/users/infra/typeorm/entities/UserTokens';
import { uuid } from 'uuidv4';
import UserToken from '@modules/users/infra/typeorm/entities/UserTokens';

class FakeUserTokensRepository implements IUsersTokensRepository {
  private userToken: UserTokens[] = [];

  public async generate(user_id: string): Promise<UserTokens> {

    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      update_at: new Date()
    })
    this.userToken.push(userToken)

    return userToken;
  }

  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = this.userToken.find(findToken => findToken.token === token);

    return userToken;
  }
}

export default FakeUserTokensRepository;
