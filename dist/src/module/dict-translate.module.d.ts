import { DynamicModule, Provider } from '@nestjs/common';
import { DictDefinition } from '../interfaces/dict.interface';
export interface DictTranslateModuleOptions {
    definitions?: DictDefinition[];
    databaseProvider?: Provider;
}
export declare class DictTranslateModule {
    static forRoot(options?: DictTranslateModuleOptions): DynamicModule;
    static forFeature(definitions?: DictDefinition[]): DynamicModule;
}
