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
exports.DATABASE_DICT_DEFINITIONS = exports.ProjectDto = exports.EmployeeDto = exports.BusinessUnitDto = void 0;
const translate_decorator_1 = require("../src/decorators/translate.decorator");
class BusinessUnitDto {
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
exports.BusinessUnitDto = BusinessUnitDto;
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'business_unit', codeField: 'unitCode', nameField: 'unitName' }),
    __metadata("design:type", String)
], BusinessUnitDto.prototype, "unitName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'business_unit', codeField: 'parentId', nameField: 'parentName' }),
    __metadata("design:type", String)
], BusinessUnitDto.prototype, "parentName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'common_status', codeField: 'status', nameField: 'statusName' }),
    __metadata("design:type", String)
], BusinessUnitDto.prototype, "statusName", void 0);
class EmployeeDto {
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
exports.EmployeeDto = EmployeeDto;
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'department', codeField: 'departmentId', nameField: 'departmentName' }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "departmentName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'position', codeField: 'positionCode', nameField: 'positionName' }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "positionName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'business_unit', codeField: 'businessUnitId', nameField: 'businessUnitName' }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "businessUnitName", void 0);
class ProjectDto {
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
exports.ProjectDto = ProjectDto;
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'business_unit', codeField: 'businessUnitId', nameField: 'businessUnitName' }),
    __metadata("design:type", String)
], ProjectDto.prototype, "businessUnitName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'project_type', codeField: 'projectType', nameField: 'projectTypeName' }),
    __metadata("design:type", String)
], ProjectDto.prototype, "projectTypeName", void 0);
__decorate([
    (0, translate_decorator_1.Translate)({ dictType: 'priority', codeField: 'priority', nameField: 'priorityName' }),
    __metadata("design:type", String)
], ProjectDto.prototype, "priorityName", void 0);
exports.DATABASE_DICT_DEFINITIONS = [
    {
        type: 'database',
        key: 'business_unit',
        tableName: 'business_unit',
        codeField: 'id',
        nameField: 'unit_name',
        condition: { status: 1 },
        ttl: 3600,
    },
    {
        type: 'database',
        key: 'department',
        tableName: 'department',
        codeField: 'id',
        nameField: 'department_name',
        condition: { status: 1 },
        ttl: 3600,
    },
    {
        type: 'database',
        key: 'position',
        tableName: 'position',
        codeField: 'position_code',
        nameField: 'position_name',
        condition: { status: 1 },
        ttl: 1800,
    },
    {
        type: 'database',
        key: 'project_type',
        tableName: 'project_type',
        codeField: 'type_code',
        nameField: 'type_name',
        condition: { is_active: true },
        ttl: 7200,
    },
    {
        type: 'database',
        key: 'priority',
        tableName: 'priority_config',
        codeField: 'priority_level',
        nameField: 'priority_name',
        ttl: 86400,
    },
    {
        type: 'code',
        key: 'common_status',
        data: [
            { code: 0, name: '禁用' },
            { code: 1, name: '启用' },
            { code: 2, name: '暂停' },
        ],
        ttl: 86400,
    }
];
//# sourceMappingURL=test-database-dtos.js.map