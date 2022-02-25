import type { CacheOptions, Entry } from '../../types/cache';
import { defaultCacheOptions } from '../../utils/defaults';

export default class Cache {
	private cache: Map<string, Entry>;
	public options: CacheOptions;
	private timer: NodeJS.Timer;

	constructor(options?: CacheOptions) {
		this.options = { ...defaultCacheOptions, ...options };
		this.cache = new Map();
		this.timer = setInterval(
			() => this.flushExpired(),
			this.options.flushInterval * 1000
		);
	}

	public get(key: string): Entry {
		const entry = this.cache.get(key);
		if (!entry) return undefined;
		return entry;
	}

	public set(key: string, value: string, ttl?: number): void {
		const entry: Entry = {
			data: value,
			ttl: ttl ?? this.options.defaultTtl,
			hits: 0,
		};
		this.cache.set(key, entry);
	}

	public getRandom(): Entry {
		return this.cache.get(
			[...this.cache.keys()][Math.floor(Math.random() * this.cache.size)]
		);
	}

	public exists(key: string): boolean {
		return this.cache.has(key);
	}

	public ttl(key: string): number {
		const entry = this.cache.get(key);
		if (!entry) return undefined;
		return entry.ttl;
	}

	public expireTime(key: string): number {
		const ttl = this.ttl(key);
		if (!ttl) return undefined;
		return Date.now() + ttl;
	}

	public setExpiry(key: string, ttl: number): void {
		if (this.exists(key)) {
			const value = this.get(key);
			this.set(key, value.data, ttl);
		} else {
			throw new Error(`Key ${key} does not exist`);
		}
	}

	public flush(key: string): void {
		this.cache.delete(key);
	}

	public flushExpired(): void {
		const now = Date.now();
		this.cache.forEach((entry, key) => {
			if (entry.ttl < now) {
				this.cache.delete(key);
			}
		});
	}

	public flushAll(): void {
		this.cache.clear();
	}

	public rename(key: string, newKey: string): void {
		if (this.cache.has(key)) {
			this.cache.set(newKey, this.cache.get(key));
			this.cache.delete(key);
		} else {
			throw new Error(`Key ${key} does not exist`);
		}
	}
}
