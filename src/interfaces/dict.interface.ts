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
  dictType: string;
  codeField: string;
  nameField: string;
  cacheKey?: string;
}