"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dict_service_1 = require("../src/services/dict.service");
const translate_service_1 = require("../src/services/translate.service");
const memory_cache_service_1 = require("../src/cache/memory-cache.service");
const test_database_dtos_1 = require("./test-database-dtos");
const globals_1 = require("@jest/globals");
const MOCK_DATABASE_DICT_DATA = {
    business_unit: [
        { id: 1, unit_name: '研发中心' },
        { id: 2, unit_name: '销售部' },
        { id: 3, unit_name: '财务部' },
        { id: 4, unit_name: '前端开发组' }
    ],
    department: [
        { id: 1, department_name: '技术部' },
        { id: 2, department_name: '市场部' },
        { id: 3, department_name: '人事部' }
    ],
    position: [
        { position_code: 'POS001', position_name: '高级工程师' },
        { position_code: 'POS002', position_name: '项目经理' },
        { position_code: 'POS003', position_name: '产品经理' }
    ],
    project_type: [
        { type_code: 'WEB', type_name: 'Web项目' },
        { type_code: 'MOBILE', type_name: '移动端项目' },
        { type_code: 'DESKTOP', type_name: '桌面应用' }
    ],
    priority: [
        { priority_level: 1, priority_name: '紧急' },
        { priority_level: 2, priority_name: '高' },
        { priority_level: 3, priority_name: '中' },
        { priority_level: 4, priority_name: '低' }
    ]
};
describe('DatabaseDictService', () => {
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
            data: MOCK_DATABASE_DICT_DATA.business_unit.map(item => ({
                code: item.id,
                name: item.unit_name
            }))
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'department',
            data: MOCK_DATABASE_DICT_DATA.department.map(item => ({
                code: item.id,
                name: item.department_name
            }))
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'position',
            data: MOCK_DATABASE_DICT_DATA.position.map(item => ({
                code: item.position_code,
                name: item.position_name
            }))
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'project_type',
            data: MOCK_DATABASE_DICT_DATA.project_type.map(item => ({
                code: item.type_code,
                name: item.type_name
            }))
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'priority',
            data: MOCK_DATABASE_DICT_DATA.priority.map(item => ({
                code: item.priority_level,
                name: item.priority_name
            }))
        });
        dictService.registerDefinition({
            type: 'code',
            key: 'common_status',
            data: [
                { code: 0, name: '禁用' },
                { code: 1, name: '启用' },
                { code: 2, name: '暂停' }
            ]
        });
    });
    describe('translateObject - 业务单元', () => {
        it('应该正确翻译业务单元对象的字典字段', async () => {
            const businessUnit = new test_database_dtos_1.BusinessUnitDto({
                id: 4,
                unitCode: 'BU004',
                parentId: 1,
                status: 1
            });
            const result = await translateService.translateObject(businessUnit);
            (0, globals_1.expect)(result.unitName).toBe('');
            (0, globals_1.expect)(result.parentName).toBe('研发中心');
            (0, globals_1.expect)(result.statusName).toBe('启用');
            (0, globals_1.expect)(result.id).toBe(4);
            (0, globals_1.expect)(result.unitCode).toBe('BU004');
        });
        it('应该处理不存在的业务单元值', async () => {
            const businessUnit = new test_database_dtos_1.BusinessUnitDto({
                id: 999,
                unitCode: 'INVALID',
                parentId: 999,
                status: 1
            });
            const result = await translateService.translateObject(businessUnit);
            (0, globals_1.expect)(result.unitName).toBe('');
            (0, globals_1.expect)(result.parentName).toBe('');
            (0, globals_1.expect)(result.statusName).toBe('启用');
        });
        it('应该处理null和undefined值', async () => {
            const businessUnit = new test_database_dtos_1.BusinessUnitDto({
                id: 1,
                unitCode: undefined,
                parentId: undefined,
                status: undefined
            });
            const result = await translateService.translateObject(businessUnit);
            (0, globals_1.expect)(result.unitName).toBeUndefined();
            (0, globals_1.expect)(result.parentName).toBeUndefined();
            (0, globals_1.expect)(result.statusName).toBeUndefined();
        });
    });
    describe('translateObject - 员工', () => {
        it('应该正确翻译员工对象的字典字段', async () => {
            const employee = new test_database_dtos_1.EmployeeDto({
                id: 1,
                employeeCode: 'EMP001',
                name: '张三',
                departmentId: 1,
                positionCode: 'POS001',
                businessUnitId: 4
            });
            const result = await translateService.translateObject(employee);
            (0, globals_1.expect)(result.departmentName).toBe('技术部');
            (0, globals_1.expect)(result.positionName).toBe('高级工程师');
            (0, globals_1.expect)(result.businessUnitName).toBe('前端开发组');
            (0, globals_1.expect)(result.name).toBe('张三');
            (0, globals_1.expect)(result.employeeCode).toBe('EMP001');
        });
        it('应该处理不存在的部门、职位和业务单元', async () => {
            const employee = new test_database_dtos_1.EmployeeDto({
                id: 1,
                employeeCode: 'EMP002',
                name: '李四',
                departmentId: 999,
                positionCode: 'INVALID',
                businessUnitId: 999
            });
            const result = await translateService.translateObject(employee);
            (0, globals_1.expect)(result.departmentName).toBe('');
            (0, globals_1.expect)(result.positionName).toBe('');
            (0, globals_1.expect)(result.businessUnitName).toBe('');
        });
    });
    describe('translateObject - 项目', () => {
        it('应该正确翻译项目对象的字典字段', async () => {
            const project = new test_database_dtos_1.ProjectDto({
                id: 1,
                projectCode: 'PROJ001',
                projectName: '新零售系统',
                businessUnitId: 1,
                projectType: 'WEB',
                priority: 2
            });
            const result = await translateService.translateObject(project);
            (0, globals_1.expect)(result.businessUnitName).toBe('研发中心');
            (0, globals_1.expect)(result.projectTypeName).toBe('Web项目');
            (0, globals_1.expect)(result.priorityName).toBe('高');
            (0, globals_1.expect)(result.projectName).toBe('新零售系统');
            (0, globals_1.expect)(result.projectCode).toBe('PROJ001');
        });
        it('应该处理不同的项目类型和优先级', async () => {
            const project = new test_database_dtos_1.ProjectDto({
                id: 2,
                projectCode: 'PROJ002',
                projectName: '移动端App',
                businessUnitId: 2,
                projectType: 'MOBILE',
                priority: 1
            });
            const result = await translateService.translateObject(project);
            (0, globals_1.expect)(result.businessUnitName).toBe('销售部');
            (0, globals_1.expect)(result.projectTypeName).toBe('移动端项目');
            (0, globals_1.expect)(result.priorityName).toBe('紧急');
        });
    });
    describe('translateArray - 业务单元', () => {
        it('应该正确翻译业务单元对象数组', async () => {
            const businessUnits = [
                new test_database_dtos_1.BusinessUnitDto({ id: 1, unitCode: 'BU001', parentId: undefined, status: 1 }),
                new test_database_dtos_1.BusinessUnitDto({ id: 2, unitCode: 'BU002', parentId: undefined, status: 1 }),
                new test_database_dtos_1.BusinessUnitDto({ id: 4, unitCode: 'BU004', parentId: 1, status: 1 })
            ];
            const results = await translateService.translateArray(businessUnits);
            (0, globals_1.expect)(results).toHaveLength(3);
            (0, globals_1.expect)(results[0].unitName).toBe('');
            (0, globals_1.expect)(results[0].parentName).toBe(undefined);
            (0, globals_1.expect)(results[1].unitName).toBe('');
            (0, globals_1.expect)(results[1].parentName).toBe(undefined);
            (0, globals_1.expect)(results[2].unitName).toBe('');
            (0, globals_1.expect)(results[2].parentName).toBe('研发中心');
        });
        it('应该正确翻译员工对象数组', async () => {
            const employees = [
                new test_database_dtos_1.EmployeeDto({
                    name: '张三',
                    departmentId: 1,
                    positionCode: 'POS001',
                    businessUnitId: 1
                }),
                new test_database_dtos_1.EmployeeDto({
                    name: '李四',
                    departmentId: 2,
                    positionCode: 'POS002',
                    businessUnitId: 2
                }),
                new test_database_dtos_1.EmployeeDto({
                    name: '王五',
                    departmentId: 3,
                    positionCode: 'POS003',
                    businessUnitId: 3
                })
            ];
            const results = await translateService.translateArray(employees);
            (0, globals_1.expect)(results).toHaveLength(3);
            (0, globals_1.expect)(results[0].departmentName).toBe('技术部');
            (0, globals_1.expect)(results[0].positionName).toBe('高级工程师');
            (0, globals_1.expect)(results[0].businessUnitName).toBe('研发中心');
            (0, globals_1.expect)(results[1].departmentName).toBe('市场部');
            (0, globals_1.expect)(results[1].positionName).toBe('项目经理');
            (0, globals_1.expect)(results[1].businessUnitName).toBe('销售部');
            (0, globals_1.expect)(results[2].departmentName).toBe('人事部');
            (0, globals_1.expect)(results[2].positionName).toBe('产品经理');
            (0, globals_1.expect)(results[2].businessUnitName).toBe('财务部');
        });
        it('应该处理空数组', async () => {
            const results = await translateService.translateArray([]);
            (0, globals_1.expect)(results).toEqual([]);
        });
        it('应该处理混合类型的数据', async () => {
            const mixedData = [
                new test_database_dtos_1.BusinessUnitDto({ id: 1, unitCode: 'BU001', parentId: undefined, status: 1 }),
                new test_database_dtos_1.EmployeeDto({ name: '张三', departmentId: 1, positionCode: 'POS001', businessUnitId: 1 }),
                new test_database_dtos_1.ProjectDto({ projectName: '新零售系统', businessUnitId: 1, projectType: 'WEB', priority: 2 })
            ];
            const results = await translateService.translateArray(mixedData);
            (0, globals_1.expect)(results).toHaveLength(3);
            (0, globals_1.expect)(results[0].unitName).toBe('');
            (0, globals_1.expect)(results[1].departmentName).toBe('技术部');
            (0, globals_1.expect)(results[2].businessUnitName).toBe('研发中心');
        });
    });
    describe('translateField - 业务单元', () => {
        it('应该正确翻译业务单元字段', async () => {
            const result = await translateService.translateField('business_unit', 1);
            (0, globals_1.expect)(result).toBe('研发中心');
        });
        it('应该正确翻译部门字段', async () => {
            const result = await translateService.translateField('department', 2);
            (0, globals_1.expect)(result).toBe('市场部');
        });
        it('应该正确翻译职位字段', async () => {
            const result = await translateService.translateField('position', 'POS001');
            (0, globals_1.expect)(result).toBe('高级工程师');
        });
        it('应该正确翻译项目类型字段', async () => {
            const result = await translateService.translateField('project_type', 'WEB');
            (0, globals_1.expect)(result).toBe('Web项目');
        });
        it('应该正确翻译优先级字段', async () => {
            const result = await translateService.translateField('priority', 3);
            (0, globals_1.expect)(result).toBe('中');
        });
        it('应该处理不存在的字典值', async () => {
            const result = await translateService.translateField('business_unit', 999);
            (0, globals_1.expect)(result).toBe('');
        });
        it('应该处理字符串类型的code', async () => {
            const result = await translateService.translateField('position', 'POS002');
            (0, globals_1.expect)(result).toBe('项目经理');
        });
    });
    describe('缓存测试', () => {
        it('应该使用缓存提高数据库字典查询性能', async () => {
            const startTime1 = Date.now();
            const text1 = await translateService.translateField('business_unit', 1);
            const duration1 = Date.now() - startTime1;
            const startTime2 = Date.now();
            const text2 = await translateService.translateField('business_unit', 1);
            const duration2 = Date.now() - startTime2;
            (0, globals_1.expect)(duration2).toBeLessThanOrEqual(duration1);
        });
        it('应该正确缓存不同的字典类型', async () => {
            await translateService.translateField('department', 1);
            await translateService.translateField('position', 'POS001');
            const result1 = await translateService.translateField('department', 1);
            const result2 = await translateService.translateField('position', 'POS001');
            (0, globals_1.expect)(result1).toBe('技术部');
            (0, globals_1.expect)(result2).toBe('高级工程师');
        });
    });
    describe('状态字典测试 - 字典', () => {
        it('应该正确翻译通用状态', async () => {
            const result1 = await translateService.translateField('common_status', 0);
            const result2 = await translateService.translateField('common_status', 1);
            const result3 = await translateService.translateField('common_status', 2);
            (0, globals_1.expect)(result1).toBe('禁用');
            (0, globals_1.expect)(result2).toBe('启用');
            (0, globals_1.expect)(result3).toBe('暂停');
        });
        it('应该处理不存在的状态值', async () => {
            const result = await translateService.translateField('common_status', 999);
            (0, globals_1.expect)(result).toBe('');
        });
    });
});
//# sourceMappingURL=database-dict.service.spec.js.map