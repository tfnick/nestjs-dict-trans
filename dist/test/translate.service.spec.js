"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dict_service_1 = require("../src/services/dict.service");
const translate_service_1 = require("../src/services/translate.service");
const memory_cache_service_1 = require("../src/cache/memory-cache.service");
const test_dtos_1 = require("./test-dtos");
describe('TranslateService', () => {
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
            key: 'user_status',
            data: [
                { code: 1, name: '正常' },
                { code: 2, name: '禁用' },
                { code: 3, name: '锁定' }
            ]
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'gender',
            data: [
                { code: 'M', name: '男' },
                { code: 'F', name: '女' },
                { code: 'U', name: '未知' }
            ]
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'product_category',
            data: [
                { code: 101, name: '电子产品' },
                { code: 102, name: '服装' },
                { code: 103, name: '食品' }
            ]
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'product_status',
            data: [
                { code: 1, name: '上架' },
                { code: 2, name: '下架' },
                { code: 3, name: '缺货' }
            ]
        });
    });
    describe('translateObject', () => {
        it('应该正确翻译单个对象的字典字段', async () => {
            const user = new test_dtos_1.UserDto({
                id: 1,
                name: '张三',
                status: 1,
                genderCode: 'M'
            });
            const result = await translateService.translateObject(user);
            expect(result.statusName).toBe('正常');
            expect(result.genderName).toBe('男');
            expect(result.id).toBe(1);
            expect(result.name).toBe('张三');
        });
        it('应该处理不存在的字典值', async () => {
            const user = new test_dtos_1.UserDto({
                id: 1,
                name: '李四',
                status: 999,
                genderCode: 'F'
            });
            const result = await translateService.translateObject(user);
            expect(result.statusName).toBe('');
            expect(result.genderName).toBe('女');
        });
        it('应该处理null和undefined值', async () => {
            const user = new test_dtos_1.UserDto({
                id: 1,
                name: '王五',
                status: undefined,
                genderCode: undefined
            });
            const result = await translateService.translateObject(user);
            expect(result.statusName).toBeUndefined();
            expect(result.genderName).toBeUndefined();
        });
        it('应该正确翻译多个字典字段', async () => {
            const product = new test_dtos_1.ProductDto({
                id: 1,
                name: 'iPhone',
                categoryId: 101,
                status: 1
            });
            const result = await translateService.translateObject(product);
            expect(result.categoryName).toBe('电子产品');
            expect(result.statusName).toBe('上架');
        });
    });
    describe('translateArray', () => {
        it('应该正确翻译对象数组', async () => {
            const users = [
                new test_dtos_1.UserDto({ id: 1, name: '张三', status: 1, genderCode: 'M' }),
                new test_dtos_1.UserDto({ id: 2, name: '李四', status: 2, genderCode: 'F' }),
                new test_dtos_1.UserDto({ id: 3, name: '王五', status: 3, genderCode: 'U' })
            ];
            const results = await translateService.translateArray(users);
            expect(results).toHaveLength(3);
            expect(results[0].statusName).toBe('正常');
            expect(results[0].genderName).toBe('男');
            expect(results[1].statusName).toBe('禁用');
            expect(results[1].genderName).toBe('女');
            expect(results[2].statusName).toBe('锁定');
            expect(results[2].genderName).toBe('未知');
        });
        it('应该处理空数组', async () => {
            const results = await translateService.translateArray([]);
            expect(results).toEqual([]);
        });
        it('应该处理混合类型的数据', async () => {
            const mixedData = [
                new test_dtos_1.UserDto({ id: 1, name: '张三', status: 1, genderCode: 'M' }),
                new test_dtos_1.ProductDto({ id: 1, name: 'iPhone', categoryId: 101, status: 1 })
            ];
            const results = await translateService.translateArray(mixedData);
            expect(results[0].statusName).toBe('正常');
            expect(results[0].genderName).toBe('男');
            expect(results[1].categoryName).toBe('电子产品');
            expect(results[1].statusName).toBe('上架');
        });
    });
    describe('translateField', () => {
        it('应该正确翻译单个字段', async () => {
            const result = await translateService.translateField('user_status', 1);
            expect(result).toBe('正常');
        });
        it('应该处理不存在的字典值', async () => {
            const result = await translateService.translateField('user_status', 999);
            expect(result).toBe('');
        });
        it('应该处理字符串类型的code', async () => {
            const result = await translateService.translateField('gender', 'F');
            expect(result).toBe('女');
        });
    });
    describe('缓存测试', () => {
        it('应该使用缓存提高性能', async () => {
            const startTime1 = Date.now();
            await translateService.translateField('user_status', 1);
            const duration1 = Date.now() - startTime1;
            const startTime2 = Date.now();
            await translateService.translateField('user_status', 1);
            const duration2 = Date.now() - startTime2;
            expect(duration2).toBeLessThanOrEqual(duration1);
        });
    });
});
//# sourceMappingURL=translate.service.spec.js.map