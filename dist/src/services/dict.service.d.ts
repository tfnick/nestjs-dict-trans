import { MemoryCacheService } from '../cache/memory-cache.service';
import { DictDefinition, DictItem, DatabaseDictService } from '../interfaces/dict.interface';
export declare class DictService {
    private cacheService;
    private databaseDictService?;
    private dictDefinitions;
    constructor(cacheService: MemoryCacheService, databaseDictService?: DatabaseDictService | undefined);
    registerDefinition(definition: DictDefinition): void;
    getDefinition(key: string): DictDefinition | undefined;
    getDictData(key: string): Promise<DictItem[]>;
    getTextByCode(key: string, code: string | number, targetField?: string): Promise<string>;
    refreshDict(key: string): Promise<void>;
    private fetchFromDatabase;
}
