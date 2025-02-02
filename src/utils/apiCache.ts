interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache: Map<string, CacheItem<any>>;
  private requestTimestamps: number[];
  private readonly maxRequestsPerHour: number;
  private readonly cacheExpirationTime: number;

  constructor(maxRequestsPerHour: number = 30, cacheExpirationTime: number = 3600000) {
    this.cache = new Map();
    this.requestTimestamps = [];
    this.maxRequestsPerHour = maxRequestsPerHour;
    this.cacheExpirationTime = cacheExpirationTime;
  }

  private cleanOldTimestamps() {
    const oneHourAgo = Date.now() - 3600000;
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => timestamp > oneHourAgo
    );
  }

  canMakeRequest(): boolean {
    this.cleanOldTimestamps();
    return this.requestTimestamps.length < this.maxRequestsPerHour;
  }

  recordRequest() {
    this.requestTimestamps.push(Date.now());
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.cacheExpirationTime;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }

  getTimeUntilNextRequest(): number {
    this.cleanOldTimestamps();
    if (this.canMakeRequest()) return 0;

    const oldestTimestamp = this.requestTimestamps[0];
    return oldestTimestamp + 3600000 - Date.now();
  }
}

export const apiCache = new APICache();
