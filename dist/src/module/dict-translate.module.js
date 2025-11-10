"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DictTranslateModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictTranslateModule = void 0;
const common_1 = require("@nestjs/common");
const dict_service_1 = require("../services/dict.service");
const translate_service_1 = require("../services/translate.service");
const memory_cache_service_1 = require("../cache/memory-cache.service");
let DictTranslateModule = DictTranslateModule_1 = class DictTranslateModule {
    static forRoot(options = {}) {
        const { definitions = [], databaseProvider } = options;
        const providers = [
            memory_cache_service_1.MemoryCacheService,
            dict_service_1.DictService,
            translate_service_1.TranslateService,
        ];
        if (databaseProvider) {
            providers.push(databaseProvider);
        }
        return {
            module: DictTranslateModule_1,
            providers,
            exports: [dict_service_1.DictService, translate_service_1.TranslateService],
        };
    }
    static forFeature(definitions = []) {
        return {
            module: DictTranslateModule_1,
            providers: [
                {
                    provide: 'DICT_DEFINITIONS',
                    useValue: definitions,
                },
                {
                    provide: 'DICT_DEFINITIONS_INITIALIZER',
                    useFactory: (dictService, defs) => {
                        defs.forEach(def => dictService.registerDefinition(def));
                        return null;
                    },
                    inject: [dict_service_1.DictService, 'DICT_DEFINITIONS'],
                },
            ],
            exports: [],
        };
    }
};
exports.DictTranslateModule = DictTranslateModule;
exports.DictTranslateModule = DictTranslateModule = DictTranslateModule_1 = __decorate([
    (0, common_1.Module)({})
], DictTranslateModule);
//# sourceMappingURL=dict-translate.module.js.map