import { container } from 'tsyringe';

import CacheProvider from './models/CacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const provider = {
  redis: RedisCacheProvider,
};

container.registerSingleton<CacheProvider>('CacheProvider', provider.redis);