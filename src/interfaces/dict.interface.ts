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

/**
 * 数据库字典查询服务接口
 * 业务系统可以实现此接口来自定义数据库查询逻辑
 */
export interface DatabaseDictService {
  /**
   * 从数据库查询字典数据
   * @param definition 字典定义
   * @returns 字典数据列表
   */
  fetchFromDatabase(definition: DictDefinition): Promise<DictItem[]>;
}

/**
 * 数据库字典查询提供者标记
 */
export const DATABASE_DICT_SERVICE = 'DATABASE_DICT_SERVICE';

export const DEFAULT_TRANSLATE_OPTIONS = {
  valueField: 'name',
} as const;