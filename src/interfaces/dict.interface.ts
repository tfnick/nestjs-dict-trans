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
  ttl?: number; // 缓存时间（秒）
}

export interface TranslateOptions {
  dictType: string; // 字典类型，全局唯一
  codeField: string; // 字典ID或者Code字典-Key
  nameField: string; // 目标设值字段名称（to）
  cacheKey?: string;
  valueField?: string; // 字典名称字段，默认name-Value（from）
}


export const DEFAULT_TRANSLATE_OPTIONS = {
  valueField: 'name',
} as const;