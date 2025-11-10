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
exports.ProductDto = exports.UserDto = void 0;
const translate_decorator_1 = require("../src/decorators/translate.decorator");
class UserDto {
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
exports.UserDto = UserDto;
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'user_status', codeField: 'status', nameField: 'statusName' }),
    __metadata("design:type", String)
], UserDto.prototype, "statusName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'gender', codeField: 'genderCode', nameField: 'genderName' }),
    __metadata("design:type", String)
], UserDto.prototype, "genderName", void 0);
class ProductDto {
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
exports.ProductDto = ProductDto;
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'product_category', codeField: 'categoryId', nameField: 'categoryName' }),
    __metadata("design:type", String)
], ProductDto.prototype, "categoryName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'product_status', codeField: 'status', nameField: 'statusName' }),
    __metadata("design:type", String)
], ProductDto.prototype, "statusName", void 0);
//# sourceMappingURL=test-dtos.js.map