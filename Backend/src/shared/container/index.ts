import { container } from 'tsyringe';
import '@modules/users/providers';
import './providers';

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRespository";
import AppointmentsRepositories from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepositories'

import IUsersRepository from "@modules/users/repositories/IUserRepository";
import UsersRepositories from '@modules/users/infra/typeorm/repositories/UserRepository'

import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import UsersTokensRepositories from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from "@modules/notifications/repositories/NotificationsRepository";
import NotificationsRepositories from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

import CacheProvider from "shared/container/providers/CacheProvider/models/CacheProvider";
import RedisCacheProvider from 'shared/container/providers/CacheProvider/implementations/RedisCacheProvider';


container.registerSingleton<IAppointmentsRepository>('AppointmentsRepositories', AppointmentsRepositories);

container.registerSingleton<IUsersRepository>('UsersRepositories', UsersRepositories);

container.registerSingleton<IUserTokensRepository>('UsersTokensRepositories', UsersTokensRepositories);

container.registerSingleton<INotificationsRepository>('NotificationsRepositories', NotificationsRepositories);

container.registerSingleton<CacheProvider>('CacheProvider', RedisCacheProvider);

