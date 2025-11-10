"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCacheService = void 0;
const common_1 = require("@nestjs/common");
let MemoryCacheService = class MemoryCacheService {
    constructor() {
        this.cache = new Map();
    }
    set(key, value, ttl) {
        const expiresAt = ttl ? Date.now() + ttl * 1000 : Number.MAX_SAFE_INTEGER;
        this.cache.set(key, { data: value, expiresAt });
    }
    get(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    has(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return false;
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
};
exports.MemoryCacheService = MemoryCacheService;
exports.MemoryCacheService = MemoryCacheService = __decorate([
    (0, common_1.Injectable)()
], MemoryCacheService);
//# sourceMappingURL=memory-cache.service.js.map