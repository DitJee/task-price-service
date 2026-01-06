import { CACHE_TTL_MS } from "../config/cache";

export interface CacheEntry {
    val: number;
    expireAt: number
}

export class PriceCache {
    private store = new Map<string, CacheEntry>();
    private readonly ttl_ms: number = 0;
    constructor() {
        this.ttl_ms = CACHE_TTL_MS;
    }

    get(key: string): number | null {
        const entry = this.store.get(key);
        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expireAt) {
            this.store.delete(key);
            return null;
        }

        return entry.val;
    }

    set(key: string, val: number) {
        this.store.set(key, {
            val,
            expireAt: Date.now() + this.ttl_ms
        })
    }
}