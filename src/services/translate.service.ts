import { Injectable } from '@nestjs/common';
import { DictService } from './dict.service';
import { TRANSLATE_METADATA_KEY } from '../decorators/translate.decorator';

@Injectable()
export class TranslateService {
  constructor(private dictService: DictService) {}

  /**
   * 翻译单个对象
   */
  async translateObject<T extends object>(obj: T): Promise<T> {
    if (!obj) return obj;

    const translations = Reflect.getMetadata(TRANSLATE_METADATA_KEY, obj.constructor) || [];
    
    for (const translation of translations) {
      const { dictType, codeField, nameField } = translation;
      const codeValue = (obj as any)[codeField];
      
      if (codeValue !== undefined && codeValue !== null) {
        const translatedName = await this.dictService.getNameByCode(dictType, codeValue);
        (obj as any)[nameField] = translatedName;
      }
    }

    return obj;
  }

  /**
   * 翻译对象数组
   */
  async translateArray<T extends object>(arr: T[]): Promise<T[]> {
    if (!Array.isArray(arr) || arr.length === 0) return arr;

    const results: T[] = [];
    for (const item of arr) {
      results.push(await this.translateObject(item));
    }

    return results;
  }

  /**
   * 手动翻译单个字段
   */
  async translateField(dictType: string, code: string | number): Promise<string> {
    return this.dictService.getNameByCode(dictType, code);
  }
}