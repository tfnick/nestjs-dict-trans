import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DictService } from '../services/dict.service';
import { TranslateService } from '../services/translate.service';
import { MemoryCacheService } from '../cache/memory-cache.service';
import { DictDefinition } from '../interfaces/dict.interface';

export interface DictTranslateModuleOptions {
  definitions?: DictDefinition[];
  databaseProvider?: Provider;
}

@Module({})
export class DictTranslateModule {
  static forRoot(options: DictTranslateModuleOptions = {}): DynamicModule {
    const { definitions = [], databaseProvider } = options;
    
    const providers: Provider[] = [
      MemoryCacheService,
      DictService,
      TranslateService,
    ];

    if (databaseProvider) {
      providers.push(databaseProvider);
    }

    return {
      module: DictTranslateModule,
      providers,
      exports: [DictService, TranslateService],
    };
  }

  static forFeature(definitions: DictDefinition[] = []): DynamicModule {
    return {
      module: DictTranslateModule,
      providers: [
        {
          provide: 'DICT_DEFINITIONS',
          useValue: definitions,
        },
        {
          provide: 'DICT_DEFINITIONS_INITIALIZER',
          useFactory: (dictService: DictService, defs: DictDefinition[]) => {
            defs.forEach(def => dictService.registerDefinition(def));
            return null;
          },
          inject: [DictService, 'DICT_DEFINITIONS'],
        },
      ],
      exports: [],
    };
  }
}