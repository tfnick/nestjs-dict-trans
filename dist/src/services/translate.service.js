"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateService = void 0;
const common_1 = require("@nestjs/common");
const dict_service_1 = require("./dict.service");
const translate_decorator_1 = require("../decorators/translate.decorator");
const dict_interface_1 = require("../interfaces/dict.interface");
let TranslateService = class TranslateService {
    constructor(dictService) {
        this.dictService = dictService;
    }
    async translateObject(obj) {
        var _a;
        if (!obj)
            return obj;
        const translations = Reflect.getMetadata(translate_decorator_1.TRANSLATE_METADATA_KEY, obj.constructor) || [];
        for (const translation of translations) {
            const { dictType, codeField, nameField, valueFiled } = translation;
            const codeValue = obj[codeField];
            if (codeValue !== undefined && codeValue !== null) {
                const targetField = valueFiled || ((_a = this.dictService.getDefinition(dictType)) === null || _a === void 0 ? void 0 : _a.nameField) || dict_interface_1.DEFAULT_TRANSLATE_OPTIONS.valueField;
                const translatedName = await this.dictService.getTextByCode(dictType, codeValue, targetField);
                obj[nameField] = translatedName;
            }
        }
        return obj;
    }
    async translateArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0)
            return arr;
        const results = [];
        for (const item of arr) {
            results.push(await this.translateObject(item));
        }
        return results;
    }
    async translateField(dictType, code, targetField = 'name') {
        return this.dictService.getTextByCode(dictType, code, targetField);
    }
};
exports.TranslateService = TranslateService;
exports.TranslateService = TranslateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dict_service_1.DictService])
], TranslateService);
//# sourceMappingURL=translate.service.js.map