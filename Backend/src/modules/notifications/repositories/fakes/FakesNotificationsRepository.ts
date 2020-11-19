import NotificationsRepository from '@modules/notifications/repositories/NotificationsRepository';
import CreateNotificationsDTO from '@modules/notifications/dtos/CreateNotificationsDTO';
import Notifications from '../../infra/typeorm/schemas/Notifications';
import { ObjectID } from 'mongodb';

export default class NotificationsRepositories implements NotificationsRepository {
  private notifications: Notifications[] = [];

  public async create({ content, recipient_id }: CreateNotificationsDTO): Promise<Notifications> {
    const notification = new Notifications();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;

  }


};