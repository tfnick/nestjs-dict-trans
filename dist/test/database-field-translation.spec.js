"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dict_service_1 = require("../src/services/dict.service");
const translate_service_1 = require("../src/services/translate.service");
const memory_cache_service_1 = require("../src/cache/memory-cache.service");
const globals_1 = require("@jest/globals");
describe('DatabaseFieldTranslation', () => {
    let translateService;
    let dictService;
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                memory_cache_service_1.MemoryCacheService,
                dict_service_1.DictService,
                translate_service_1.TranslateService,
            ],
        }).compile();
        translateService = moduleRef.get(translate_service_1.TranslateService);
        dictService = moduleRef.get(dict_service_1.DictService);
        dictService.registerDefinition({
            type: 'code',
            key: 'business_unit',
            data: [
                { id: 1, code: 11, name: '研发中心', unit_code: 'BU001', unit_name: '研发中心', parent_id: undefined, status: 1 },
                { id: 2, code: 22, name: '销售部', unit_code: 'BU002', unit_name: '销售部', parent_id: undefined, status: 1 },
                { id: 3, code: 33, name: '财务部', unit_code: 'BU003', unit_name: '财务部', parent_id: undefined, status: 1 },
                { id: 4, code: 44, name: '前端开发组', unit_code: 'BU004', unit_name: '前端开发组', parent_id: 1, status: 1 }
            ],
            codeField: 'id',
            nameField: 'unit_name'
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'department',
            data: [
                { id: 1, code: 1, name: '技术部', dept_code: 'DEPT001', dept_name: '技术部', status: 1 },
                { id: 2, code: 2, name: '市场部', dept_code: 'DEPT002', dept_name: '市场部', status: 1 },
                { id: 3, code: 3, name: '人事部', dept_code: 'DEPT003', dept_name: '人事部', status: 1 }
            ],
            codeField: 'id',
            nameField: 'dept_name'
        });
    });
    describe('根据ID翻译不同字段值', () => {
        it('应该根据ID翻译出name字段的值', async () => {
            const result = await translateService.translateField('business_unit', 1);
            (0, globals_1.expect)(result).toBe('研发中心');
        });
        it('应该根据ID翻译出code字段的值', async () => {
            const result = await translateService.translateField('business_unit', 1, 'unit_code');
            (0, globals_1.expect)(result).toBe('BU001');
        });
        it('应该根据ID翻译出任意字段的值', async () => {
            const result = await translateService.translateField('business_unit', 4, 'parent_id');
            (0, globals_1.expect)(result).toBe(1);
        });
        it('应该处理不存在的字段', async () => {
            const result = await translateService.translateField('business_unit', 1, 'nonexistent_field');
            (0, globals_1.expect)(result).toBeUndefined();
        });
    });
    describe('部门字典多字段翻译', () => {
        it('应该根据部门ID翻译部门名称', async () => {
            const result = await translateService.translateField('department', 2);
            (0, globals_1.expect)(result).toBe('市场部');
        });
        it('应该根据部门ID翻译部门代码', async () => {
            const result = await translateService.translateField('department', 2, 'dept_code');
            (0, globals_1.expect)(result).toBe('DEPT002');
        });
        it('应该根据部门ID翻译状态字段', async () => {
            const result = await translateService.translateField('department', 2, 'status');
            (0, globals_1.expect)(result).toBe(1);
        });
    });
    describe('业务场景演示', () => {
        it('应该支持业务单元ID到代码的翻译', async () => {
            const unitCode = await translateService.translateField('business_unit', 4, 'unit_code');
            (0, globals_1.expect)(unitCode).toBe('BU004');
        });
        it('应该支持业务单元ID到名称的翻译', async () => {
            const unitName = await translateService.translateField('business_unit', 4);
            (0, globals_1.expect)(unitName).toBe('前端开发组');
        });
        it('应该支持父子关系查询', async () => {
            const parentId = await translateService.translateField('business_unit', 4, 'parent_id');
            const parentName = await translateService.translateField('business_unit', parentId);
            (0, globals_1.expect)(parentId).toBe(1);
            (0, globals_1.expect)(parentName).toBe('研发中心');
        });
    });
    describe('错误处理', () => {
        it('应该处理不存在的字典值', async () => {
            const result = await translateService.translateField('business_unit', 999, 'unit_name');
            (0, globals_1.expect)(result).toBe('');
        });
        it('应该处理不存在的字典key', async () => {
            await (0, globals_1.expect)(translateService.translateField('nonexistent_dict', 1, 'unit_name'))
                .rejects.toThrow();
        });
    });
    describe('性能测试', () => {
        it('应该缓存多次查询结果', async () => {
            const startTime1 = Date.now();
            await translateService.translateField('business_unit', 1, 'unit_code');
            const duration1 = Date.now() - startTime1;
            const startTime2 = Date.now();
            await translateService.translateField('business_unit', 1, 'unit_code');
            const duration2 = Date.now() - startTime2;
            (0, globals_1.expect)(duration2).toBeLessThanOrEqual(duration1);
        });
    });
});
//# sourceMappingURL=database-field-translation.spec.js.map