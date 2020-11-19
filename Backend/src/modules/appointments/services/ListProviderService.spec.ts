import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProviderService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakesCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()
    listProvidersService = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  })
  it('should to be able list the providers', async () => {

    const user1 = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })
    const user2 = await fakeUsersRepository.create({
      name: 'Jhon tre',
      email: 'jhondoetre@gmail.com',
      password: '123'
    })
    const loggedUser = await fakeUsersRepository.create({
      name: 'Jhon qua',
      email: 'jhondoequa@gmail.com',
      password: '123'
    })

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([
      user1, user2,
    ]);
  });
})