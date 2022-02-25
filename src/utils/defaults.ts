import type { CacheOptions } from '../types/cache';

export const defaultCacheOptions: CacheOptions = {
	maxEntries: -1,
	defaultTtl: 360,
	flushInterval: 60,
};
