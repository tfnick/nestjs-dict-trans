export interface DictItem {
    code: string | number;
    name: string;
    [key: string]: any;
}
export interface DictDefinition {
    type: 'code' | 'database' | 'config';
    key: string;
    codeField?: string;
    nameField?: string;
    data?: DictItem[];
    tableName?: string;
    condition?: any;
    ttl?: number;
}
export interface TranslateOptions {
    dictType: string;
    codeField: string;
    nameField: string;
    cacheKey?: string;
    valueField?: string;
}
export interface DatabaseDictService {
    fetchFromDatabase(definition: DictDefinition): Promise<DictItem[]>;
}
export declare const DATABASE_DICT_SERVICE = "DATABASE_DICT_SERVICE";
export declare const DEFAULT_TRANSLATE_OPTIONS: {
    readonly valueField: "name";
};
