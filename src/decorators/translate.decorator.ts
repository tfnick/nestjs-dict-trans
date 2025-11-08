import { SetMetadata } from '@nestjs/common';
import { TranslateOptions } from '../interfaces/dict.interface';

export const TRANSLATE_METADATA_KEY = 'dict:translate';

export function Translate(options: TranslateOptions): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const existingTranslations = Reflect.getMetadata(TRANSLATE_METADATA_KEY, target.constructor) || [];
    
    const translation = {
      ...options,
      targetField: propertyKey,
    };
    
    Reflect.defineMetadata(
      TRANSLATE_METADATA_KEY,
      [...existingTranslations, translation],
      target.constructor
    );
  };
}