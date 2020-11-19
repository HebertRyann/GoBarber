import NotificationsRepository from '@modules/notifications/repositories/NotificationsRepository';
import CreateNotificationsDTO from '@modules/notifications/dtos/CreateNotificationsDTO';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notifications from '../schemas/Notifications';

export default class NotificationsRepositories implements NotificationsRepository {
  private ormRepository: MongoRepository<Notifications>;
  constructor() {
    this.ormRepository = getMongoRepository(Notifications, 'mongo')
  }

  public async create({ content, recipient_id }: CreateNotificationsDTO): Promise<Notifications> {
    const notification = this.ormRepository.create({
      content,
      recipient_id
    })

    await this.ormRepository.save(notification)

    return notification;

  }


};