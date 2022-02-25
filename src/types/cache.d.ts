export type Entry = {
	data: string;
	ttl: number;
	hits: number;
};

export type CacheOptions = {
	maxAge?: number;
	maxEntries?: number;
	defaultTtl?: number;
	flushInterval?: number;
};
