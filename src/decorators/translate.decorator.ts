import 'reflect-metadata';
import { TranslateOptions } from '../interfaces/dict.interface';

export const TRANSLATE_METADATA_KEY = 'dict:translate';

export function Translate(options: TranslateOptions): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    // 获取目标类的构造函数
    const constructor = typeof target === 'function' ? target : target.constructor;
    
    const existingTranslations = Reflect.getMetadata(TRANSLATE_METADATA_KEY, constructor) || [];
    
    const translation = {
      ...options,
      targetField: propertyKey,
    };
    
    Reflect.defineMetadata(
      TRANSLATE_METADATA_KEY,
      [...existingTranslations, translation],
      constructor
    );
  };
}