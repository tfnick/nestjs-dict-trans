"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictService = void 0;
const common_1 = require("@nestjs/common");
const memory_cache_service_1 = require("../cache/memory-cache.service");
const dict_interface_1 = require("../interfaces/dict.interface");
let DictService = class DictService {
    constructor(cacheService, databaseDictService) {
        this.cacheService = cacheService;
        this.databaseDictService = databaseDictService;
        this.dictDefinitions = new Map();
    }
    registerDefinition(definition) {
        this.dictDefinitions.set(definition.key, definition);
    }
    getDefinition(key) {
        return this.dictDefinitions.get(key);
    }
    async getDictData(key) {
        const definition = this.dictDefinitions.get(key);
        if (!definition) {
            throw new Error(`Dictionary definition not found: ${key}`);
        }
        const cacheKey = `dict:${key}`;
        const cached = this.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        let data = [];
        switch (definition.type) {
            case 'code':
                data = definition.data || [];
                break;
            case 'database':
                data = await this.fetchFromDatabase(definition);
                break;
            case 'config':
                data = definition.data || [];
                break;
        }
        this.cacheService.set(cacheKey, data, definition.ttl || 3600);
        return data;
    }
    async getTextByCode(key, code, targetField = 'name') {
        const dictData = await this.getDictData(key);
        const definition = this.dictDefinitions.get(key);
        const codeField = (definition === null || definition === void 0 ? void 0 : definition.codeField) || 'code';
        const item = dictData.find(d => d[codeField] === code);
        return item ? item[targetField] : '';
    }
    async refreshDict(key) {
        const cacheKey = `dict:${key}`;
        this.cacheService.delete(cacheKey);
        await this.getDictData(key);
    }
    async fetchFromDatabase(definition) {
        if (this.databaseDictService) {
            return await this.databaseDictService.fetchFromDatabase(definition);
        }
        console.warn(`DatabaseDictService not implemented for dictionary: ${definition.key}`);
        return [];
    }
};
exports.DictService = DictService;
exports.DictService = DictService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(dict_interface_1.DATABASE_DICT_SERVICE)),
    __metadata("design:paramtypes", [memory_cache_service_1.MemoryCacheService, Object])
], DictService);
//# sourceMappingURL=dict.service.js.map