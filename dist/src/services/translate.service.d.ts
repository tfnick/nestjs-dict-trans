import { DictService } from './dict.service';
export declare class TranslateService {
    private dictService;
    constructor(dictService: DictService);
    translateObject<T extends object>(obj: T): Promise<T>;
    translateArray<T extends object>(arr: T[]): Promise<T[]>;
    translateField(dictType: string, code: string | number, targetField?: string): Promise<string>;
}
