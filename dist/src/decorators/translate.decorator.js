"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSLATE_METADATA_KEY = void 0;
exports.Translate = Translate;
require("reflect-metadata");
exports.TRANSLATE_METADATA_KEY = 'dict:translate';
function Translate(options) {
    return function (target, propertyKey) {
        const constructor = typeof target === 'function' ? target : target.constructor;
        const existingTranslations = Reflect.getMetadata(exports.TRANSLATE_METADATA_KEY, constructor) || [];
        const translation = {
            ...options,
            targetField: propertyKey,
        };
        Reflect.defineMetadata(exports.TRANSLATE_METADATA_KEY, [...existingTranslations, translation], constructor);
    };
}
//# sourceMappingURL=translate.decorator.js.map