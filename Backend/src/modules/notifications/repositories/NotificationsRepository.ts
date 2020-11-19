import CreateNotificationsDTO from '../dtos/CreateNotificationsDTO';
import Notifcations from '../infra/typeorm/schemas/Notifications';

export default interface NotificationsRepository {
  create(data: CreateNotificationsDTO): Promise<Notifcations>
}