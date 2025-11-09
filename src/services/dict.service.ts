import { Injectable, Inject } from '@nestjs/common';
import { MemoryCacheService } from '../cache/memory-cache.service';
import { DictDefinition, DictItem } from '../interfaces/dict.interface';

@Injectable()
export class DictService {
  private dictDefinitions = new Map<string, DictDefinition>();

  constructor(private cacheService: MemoryCacheService) {}

  /**
   * 注册字典定义
   */
  registerDefinition(definition: DictDefinition): void {
    this.dictDefinitions.set(definition.key, definition);
  }

  getDefinition(key: string): DictDefinition | undefined {
    return this.dictDefinitions.get(key);
  }
  /**
   * 获取字典数据
   */
  async getDictData(key: string): Promise<DictItem[]> {
    const definition = this.dictDefinitions.get(key);
    if (!definition) {
      throw new Error(`Dictionary definition not found: ${key}`);
    }

    // 检查缓存
    const cacheKey = `dict:${key}`;
    const cached = this.cacheService.get<DictItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 根据类型获取数据
    let data: DictItem[] = [];
    switch (definition.type) {
      case 'code':
        data = definition.data || [];
        break;
      case 'database':
        // 这里需要集成数据库查询，暂时返回空数组
        data = await this.fetchFromDatabase(definition);
        break;
      case 'config':
        data = definition.data || [];
        break;
    }

    // 缓存数据
    this.cacheService.set(cacheKey, data, definition.ttl || 3600);
    
    return data;
  }

  /**
   * 根据code获取字典项名称
   */
  async getTextByCode(key: string, code: string | number, targetField: string = 'name'): Promise<string> {
    const dictData = await this.getDictData(key);
    const definition = this.dictDefinitions.get(key);
    const codeField = definition?.codeField || 'code';

    const item = dictData.find(d => d[codeField] === code);
    return item ? item[targetField] : '';
  }

  /**
   * 刷新字典缓存
   */
  async refreshDict(key: string): Promise<void> {
    const cacheKey = `dict:${key}`;
    this.cacheService.delete(cacheKey);
    await this.getDictData(key); // 重新加载
  }

  /**
   * 从数据库获取字典数据（需要业务系统实现）
   */
  private async fetchFromDatabase(definition: DictDefinition): Promise<DictItem[]> {
    // 这里需要业务系统提供数据库查询实现
    // 可以通过自定义Provider来注入数据库服务
    return [];
  }
}