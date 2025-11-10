export declare class MemoryCacheService {
    private cache;
    set(key: string, value: any, ttl?: number): void;
    get<T = any>(key: string): T | null;
    delete(key: string): boolean;
    clear(): void;
    has(key: string): boolean;
}
