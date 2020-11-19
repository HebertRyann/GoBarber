import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarServices';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUSerAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()
    updateUSerAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  })
  it('should to be able a new User', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    await updateUSerAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    })

    expect(user.avatar).toBe('avatar.jpg');
  });
  it('should not be able update a avatar from non existi user', async () => {

    expect(updateUSerAvatar.execute({
      user_id: 'user-Not-Existing',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });
  it('should delete old avatar when  updating new one', async () => {


    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123'
    })

    await updateUSerAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    await updateUSerAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });

});