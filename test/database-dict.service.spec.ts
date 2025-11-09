import { Test } from '@nestjs/testing';
import { DictService } from '../src/services/dict.service';
import { TranslateService } from '../src/services/translate.service';
import { MemoryCacheService } from '../src/cache/memory-cache.service';
import { BusinessUnitDto, EmployeeDto, ProjectDto } from './test-database-dtos';

// 添加 expect 导入
import { expect } from '@jest/globals';

// 模拟数据库字典数据
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
  let translateService: TranslateService;
  let dictService: DictService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MemoryCacheService,
        DictService,
        TranslateService,
      ],
    }).compile();

    translateService = moduleRef.get<TranslateService>(TranslateService);
    dictService = moduleRef.get<DictService>(DictService);

    // 注册模拟的字典数据（替代数据库查询）
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
      const businessUnit = new BusinessUnitDto({
        id: 4,
        unitCode: 'BU004',
        parentId: 1,
        status: 1
      });

      const result = await translateService.translateObject(businessUnit);

      expect(result.unitName).toBe('');
      expect(result.parentName).toBe('研发中心');
      expect(result.statusName).toBe('启用');
      expect(result.id).toBe(4);
      expect(result.unitCode).toBe('BU004');
    });

    it('应该处理不存在的业务单元值', async () => {
      const businessUnit = new BusinessUnitDto({
        id: 999, // 不存在的业务单元ID
        unitCode: 'INVALID',
        parentId: 999, // 不存在的父级ID
        status: 1
      });

      const result = await translateService.translateObject(businessUnit);

      expect(result.unitName).toBe('');
      expect(result.parentName).toBe('');
      expect(result.statusName).toBe('启用');
    });

    it('应该处理null和undefined值', async () => {
      const businessUnit = new BusinessUnitDto({
        id: 1,
        unitCode: undefined,
        parentId: undefined,
        status: undefined
      });

      const result = await translateService.translateObject(businessUnit);

      expect(result.unitName).toBeUndefined();
      expect(result.parentName).toBeUndefined();
      expect(result.statusName).toBeUndefined();
    });
  });

  describe('translateObject - 员工', () => {
    it('应该正确翻译员工对象的字典字段', async () => {
      const employee = new EmployeeDto({
        id: 1,
        employeeCode: 'EMP001',
        name: '张三',
        departmentId: 1,
        positionCode: 'POS001',
        businessUnitId: 4
      });

      const result = await translateService.translateObject(employee);

      expect(result.departmentName).toBe('技术部');
      expect(result.positionName).toBe('高级工程师');
      expect(result.businessUnitName).toBe('前端开发组');
      expect(result.name).toBe('张三');
      expect(result.employeeCode).toBe('EMP001');
    });

    it('应该处理不存在的部门、职位和业务单元', async () => {
      const employee = new EmployeeDto({
        id: 1,
        employeeCode: 'EMP002',
        name: '李四',
        departmentId: 999, // 不存在的部门
        positionCode: 'INVALID', // 不存在的职位
        businessUnitId: 999 // 不存在的业务单元
      });

      const result = await translateService.translateObject(employee);

      expect(result.departmentName).toBe('');
      expect(result.positionName).toBe('');
      expect(result.businessUnitName).toBe('');
    });
  });

  describe('translateObject - 项目', () => {
    it('应该正确翻译项目对象的字典字段', async () => {
      const project = new ProjectDto({
        id: 1,
        projectCode: 'PROJ001',
        projectName: '新零售系统',
        businessUnitId: 1,
        projectType: 'WEB',
        priority: 2
      });

      const result = await translateService.translateObject(project);

      expect(result.businessUnitName).toBe('研发中心');
      expect(result.projectTypeName).toBe('Web项目');
      expect(result.priorityName).toBe('高');
      expect(result.projectName).toBe('新零售系统');
      expect(result.projectCode).toBe('PROJ001');
    });

    it('应该处理不同的项目类型和优先级', async () => {
      const project = new ProjectDto({
        id: 2,
        projectCode: 'PROJ002',
        projectName: '移动端App',
        businessUnitId: 2,
        projectType: 'MOBILE',
        priority: 1
      });

      const result = await translateService.translateObject(project);

      expect(result.businessUnitName).toBe('销售部');
      expect(result.projectTypeName).toBe('移动端项目');
      expect(result.priorityName).toBe('紧急');
    });
  });

  describe('translateArray - 业务单元', () => {
    it('应该正确翻译业务单元对象数组', async () => {
      const businessUnits = [
        new BusinessUnitDto({ id: 1, unitCode: 'BU001', parentId: undefined, status: 1 }),
        new BusinessUnitDto({ id: 2, unitCode: 'BU002', parentId: undefined, status: 1 }),
        new BusinessUnitDto({ id: 4, unitCode: 'BU004', parentId: 1, status: 1 })
      ];

      const results = await translateService.translateArray(businessUnits);

      expect(results).toHaveLength(3);
      expect(results[0].unitName).toBe('');
      expect(results[0].parentName).toBe(undefined);
      expect(results[1].unitName).toBe('');
      expect(results[1].parentName).toBe(undefined);
      expect(results[2].unitName).toBe('');
      expect(results[2].parentName).toBe('研发中心');
    });

    it('应该正确翻译员工对象数组', async () => {
      const employees = [
        new EmployeeDto({ 
          name: '张三', 
          departmentId: 1, 
          positionCode: 'POS001', 
          businessUnitId: 1 
        }),
        new EmployeeDto({ 
          name: '李四', 
          departmentId: 2, 
          positionCode: 'POS002', 
          businessUnitId: 2 
        }),
        new EmployeeDto({ 
          name: '王五', 
          departmentId: 3, 
          positionCode: 'POS003', 
          businessUnitId: 3 
        })
      ];

      const results = await translateService.translateArray(employees);

      expect(results).toHaveLength(3);
      expect(results[0].departmentName).toBe('技术部');
      expect(results[0].positionName).toBe('高级工程师');
      expect(results[0].businessUnitName).toBe('研发中心');
      expect(results[1].departmentName).toBe('市场部');
      expect(results[1].positionName).toBe('项目经理');
      expect(results[1].businessUnitName).toBe('销售部');
      expect(results[2].departmentName).toBe('人事部');
      expect(results[2].positionName).toBe('产品经理');
      expect(results[2].businessUnitName).toBe('财务部');
    });

    it('应该处理空数组', async () => {
      const results = await translateService.translateArray([]);
      expect(results).toEqual([]);
    });

    it('应该处理混合类型的数据', async () => {
      const mixedData = [
        new BusinessUnitDto({ id: 1, unitCode: 'BU001', parentId: undefined, status: 1 }),
        new EmployeeDto({ name: '张三', departmentId: 1, positionCode: 'POS001', businessUnitId: 1 }),
        new ProjectDto({ projectName: '新零售系统', businessUnitId: 1, projectType: 'WEB', priority: 2 })
      ];

      const results = await translateService.translateArray(mixedData);

      expect(results).toHaveLength(3);
      expect((results[0] as BusinessUnitDto).unitName).toBe('');
      expect((results[1] as EmployeeDto).departmentName).toBe('技术部');
      expect((results[2] as ProjectDto).businessUnitName).toBe('研发中心');
    });
  });

  describe('translateField - 业务单元', () => {
    it('应该正确翻译业务单元字段', async () => {
      const result = await translateService.translateField('business_unit', 1);
      expect(result).toBe('研发中心');
    });

    it('应该正确翻译部门字段', async () => {
      const result = await translateService.translateField('department', 2);
      expect(result).toBe('市场部');
    });

    it('应该正确翻译职位字段', async () => {
      const result = await translateService.translateField('position', 'POS001');
      expect(result).toBe('高级工程师');
    });

    it('应该正确翻译项目类型字段', async () => {
      const result = await translateService.translateField('project_type', 'WEB');
      expect(result).toBe('Web项目');
    });

    it('应该正确翻译优先级字段', async () => {
      const result = await translateService.translateField('priority', 3);
      expect(result).toBe('中');
    });

    it('应该处理不存在的字典值', async () => {
      const result = await translateService.translateField('business_unit', 999);
      expect(result).toBe('');
    });

    it('应该处理字符串类型的code', async () => {
      const result = await translateService.translateField('position', 'POS002');
      expect(result).toBe('项目经理');
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

      // 第二次调用应该更快（使用缓存）
      expect(duration2).toBeLessThanOrEqual(duration1);
    });

    it('应该正确缓存不同的字典类型', async () => {
      // 第一次查询
      await translateService.translateField('department', 1);
      await translateService.translateField('position', 'POS001');

      // 第二次查询应该使用缓存
      const result1 = await translateService.translateField('department', 1);
      const result2 = await translateService.translateField('position', 'POS001');

      expect(result1).toBe('技术部');
      expect(result2).toBe('高级工程师');
    });
  });

  describe('状态字典测试 - 字典', () => {
    it('应该正确翻译通用状态', async () => {
      const result1 = await translateService.translateField('common_status', 0);
      const result2 = await translateService.translateField('common_status', 1);
      const result3 = await translateService.translateField('common_status', 2);

      expect(result1).toBe('禁用');
      expect(result2).toBe('启用');
      expect(result3).toBe('暂停');
    });

    it('应该处理不存在的状态值', async () => {
      const result = await translateService.translateField('common_status', 999);
      expect(result).toBe('');
    });
  });
});