"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCacheService = exports.TranslateService = exports.DictService = exports.Translate = exports.DictTranslateModule = void 0;
var dict_translate_module_1 = require("./module/dict-translate.module");
Object.defineProperty(exports, "DictTranslateModule", { enumerable: true, get: function () { return dict_translate_module_1.DictTranslateModule; } });
var translate_decorator_1 = require("./decorators/translate.decorator");
Object.defineProperty(exports, "Translate", { enumerable: true, get: function () { return translate_decorator_1.Translate; } });
var dict_service_1 = require("./services/dict.service");
Object.defineProperty(exports, "DictService", { enumerable: true, get: function () { return dict_service_1.DictService; } });
var translate_service_1 = require("./services/translate.service");
Object.defineProperty(exports, "TranslateService", { enumerable: true, get: function () { return translate_service_1.TranslateService; } });
var memory_cache_service_1 = require("./cache/memory-cache.service");
Object.defineProperty(exports, "MemoryCacheService", { enumerable: true, get: function () { return memory_cache_service_1.MemoryCacheService; } });
__exportStar(require("./interfaces/dict.interface"), exports);
//# sourceMappingURL=index.js.map