import { Test } from '@nestjs/testing';
import { DictService } from '../src/services/dict.service';
import { TranslateService } from '../src/services/translate.service';
import { MemoryCacheService } from '../src/cache/memory-cache.service';
import { expect } from '@jest/globals';

describe('DatabaseFieldTranslation', () => {
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

    // 注册业务单元字典（模拟数据库表数据）
    dictService.registerDefinition({
      type: 'code',
      key: 'business_unit',
      data: [
        { id: 1, code: 1, name: '研发中心', unit_code: 'BU001', unit_name: '研发中心', parent_id: undefined, status: 1 },
        { id: 2, code: 2, name: '销售部', unit_code: 'BU002', unit_name: '销售部', parent_id: undefined, status: 1 },
        { id: 3, code: 3, name: '财务部', unit_code: 'BU003', unit_name: '财务部', parent_id: undefined, status: 1 },
        { id: 4, code: 4, name: '前端开发组', unit_code: 'BU004', unit_name: '前端开发组', parent_id: 1, status: 1 }
      ],
      codeField: 'id',
      nameField: 'unit_name'
    });

    // 注册部门字典
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
      expect(result).toBe('研发中心');
    });

    it('应该根据ID翻译出code字段的值', async () => {
      const result = await translateService.translateFieldTo('business_unit', 1, 'unit_code');
      expect(result).toBe('BU001');
    });

    it('应该根据ID翻译出任意字段的值', async () => {
      const result = await translateService.translateFieldTo('business_unit', 4, 'parent_id');
      expect(result).toBe(1);
    });

    it('应该处理不存在的字段', async () => {
      const result = await translateService.translateFieldTo('business_unit', 1, 'nonexistent_field');
      expect(result).toBeUndefined();
    });
  });

  describe('部门字典多字段翻译', () => {
    it('应该根据部门ID翻译部门名称', async () => {
      const result = await translateService.translateField('department', 2);
      expect(result).toBe('市场部');
    });

    it('应该根据部门ID翻译部门代码', async () => {
      const result = await translateService.translateFieldTo('department', 2, 'dept_code');
      expect(result).toBe('DEPT002');
    });

    it('应该根据部门ID翻译状态字段', async () => {
      const result = await translateService.translateFieldTo('department', 2, 'status');
      expect(result).toBe(1);
    });
  });

  describe('业务场景演示', () => {
    it('应该支持业务单元ID到代码的翻译', async () => {
      // 场景：在需要显示业务单元代码的地方
      const unitCode = await translateService.translateFieldTo('business_unit', 4, 'unit_code');
      expect(unitCode).toBe('BU004');
    });

    it('应该支持业务单元ID到名称的翻译', async () => {
      // 场景：在需要显示业务单元名称的地方
      const unitName = await translateService.translateField('business_unit', 4);
      expect(unitName).toBe('前端开发组');
    });

    it('应该支持父子关系查询', async () => {
      // 场景：需要知道父级业务单元的信息
      const parentId = await translateService.translateFieldTo('business_unit', 4, 'parent_id');
      const parentName = await translateService.translateField('business_unit', parentId);
      
      expect(parentId).toBe(1);
      expect(parentName).toBe('研发中心');
    });
  });

  describe('错误处理', () => {
    it('应该处理不存在的字典值', async () => {
      const result = await translateService.translateFieldTo('business_unit', 999, 'unit_name');
      expect(result).toBe('');
    });

    it('应该处理不存在的字典key', async () => {
      await expect(translateService.translateFieldTo('nonexistent_dict', 1, 'unit_name'))
        .rejects.toThrow();
    });
  });

  describe('性能测试', () => {
    it('应该缓存多次查询结果', async () => {
      const startTime1 = Date.now();
      await translateService.translateFieldTo('business_unit', 1, 'unit_code');
      const duration1 = Date.now() - startTime1;

      const startTime2 = Date.now();
      await translateService.translateFieldTo('business_unit', 1, 'unit_code');
      const duration2 = Date.now() - startTime2;

      // 第二次调用应该更快（使用缓存）
      expect(duration2).toBeLessThanOrEqual(duration1);
    });
  });
});