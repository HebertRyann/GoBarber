import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository);
  })
  it('should to be able show the profile', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    const profile = await showProfileService.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('Jhon Doe');
    expect(profile.email).toBe('jhondoe@gmail.com');
  });
  it('should not be able show the profile from non-existing user', async () => {
    await expect(showProfileService.execute({
      user_id: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError)
  });
})