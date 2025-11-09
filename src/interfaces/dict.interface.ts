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
  nameField: string; // 默认设置对象的nameField字段（to）
  cacheKey?: string;
  dictNameField?: string; // 默认取字典的name字段（from），默认值为'name'
}


export const DEFAULT_TRANSLATE_OPTIONS = {
  dictNameField: 'name',
} as const;