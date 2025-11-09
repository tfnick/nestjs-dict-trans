import { Translate } from '../src/decorators/translate.decorator';

/**
 * 业务单元DTO - 基于数据库表 business_unit
 * 假设数据库表结构：
 * - id: 主键
 * - unit_code: 业务单元代码
 * - unit_name: 业务单元名称
 * - parent_id: 父级业务单元ID
 * - status: 状态 (0-禁用, 1-启用)
 */
export class BusinessUnitDto {
  id?: number;
  
  unitCode?: string;        // 业务单元代码
  
  @Translate({dictType: 'business_unit', codeField: 'unitCode', nameField: 'unitName'})
  unitName?: string;        // 业务单元名称（从数据库翻译）
  
  parentId?: number;        // 父级业务单元ID
  
  @Translate({dictType: 'business_unit', codeField: 'parentId', nameField: 'parentName'})
  parentName?: string;     // 父级业务单元名称（从数据库翻译）
  
  status?: number;          // 状态代码
  
  @Translate({dictType: 'common_status', codeField: 'status', nameField: 'statusName'})
  statusName?: string;     // 状态名称

  constructor(data: Partial<BusinessUnitDto> = {}) {
    Object.assign(this, data);
  }
}

/**
 * 员工DTO - 基于数据库表 employee
 * 假设数据库表结构：
 * - id: 主键
 * - employee_code: 员工编号
 * - name: 员工姓名
 * - department_id: 部门ID
 * - position_code: 职位代码
 * - business_unit_id: 所属业务单元ID
 */
export class EmployeeDto {
  id?: number;
  
  employeeCode?: string;    // 员工编号
  
  name?: string;           // 员工姓名
  
  departmentId?: number;    // 部门ID
  
  @Translate({dictType: 'department', codeField: 'departmentId', nameField: 'departmentName'})
  departmentName?: string;  // 部门名称（从数据库翻译）
  
  positionCode?: string;    // 职位代码
  
  @Translate({dictType: 'position', codeField: 'positionCode', nameField: 'positionName'})
  positionName?: string;    // 职位名称（从数据库翻译）
  
  businessUnitId?: number;  // 业务单元ID
  
  @Translate({dictType: 'business_unit', codeField: 'businessUnitId', nameField: 'businessUnitName'})
  businessUnitName?: string; // 业务单元名称（从数据库翻译）

  constructor(data: Partial<EmployeeDto> = {}) {
    Object.assign(this, data);
  }
}

/**
 * 项目DTO - 基于数据库表 project
 * 假设数据库表结构：
 * - id: 主键
 * - project_code: 项目编号
 * - project_name: 项目名称
 * - business_unit_id: 所属业务单元ID
 * - project_type: 项目类型代码
 * - priority: 优先级代码
 */
export class ProjectDto {
  id?: number;
  
  projectCode?: string;     // 项目编号
  
  projectName?: string;     // 项目名称
  
  businessUnitId?: number;  // 业务单元ID
  
  @Translate({dictType: 'business_unit', codeField: 'businessUnitId', nameField: 'businessUnitName'})
  businessUnitName?: string; // 业务单元名称（从数据库翻译）
  
  projectType?: string;     // 项目类型代码
  
  @Translate({dictType: 'project_type', codeField: 'projectType', nameField: 'projectTypeName'})
  projectTypeName?: string; // 项目类型名称（从数据库翻译）
  
  priority?: number;        // 优先级代码
  
  @Translate({dictType: 'priority', codeField: 'priority', nameField: 'priorityName'})
  priorityName?: string;    // 优先级名称

  constructor(data: Partial<ProjectDto> = {}) {
    Object.assign(this, data);
  }
}

/**
 * 数据库字典配置示例
 * 这些配置需要在应用启动时注册到DictService中
 */
export const DATABASE_DICT_DEFINITIONS = [
  // 业务单元字典 - 从business_unit表查询
  {
    type: 'database' as const,
    key: 'business_unit',
    tableName: 'business_unit',
    codeField: 'id',        // 使用id作为代码字段
    nameField: 'unit_name', // 使用unit_name作为名称字段
    condition: { status: 1 }, // 只查询启用的业务单元
    ttl: 3600,              // 缓存1小时
  },
  
  // 部门字典 - 从department表查询
  {
    type: 'database' as const,
    key: 'department',
    tableName: 'department',
    codeField: 'id',
    nameField: 'department_name',
    condition: { status: 1 }, // 只查询启用的部门
    ttl: 3600,
  },
  
  // 职位字典 - 从position表查询
  {
    type: 'database' as const,
    key: 'position',
    tableName: 'position',
    codeField: 'position_code',
    nameField: 'position_name',
    condition: { status: 1 }, // 只查询启用的职位
    ttl: 1800,              // 缓存30分钟
  },
  
  // 项目类型字典 - 从project_type表查询
  {
    type: 'database' as const,
    key: 'project_type',
    tableName: 'project_type',
    codeField: 'type_code',
    nameField: 'type_name',
    condition: { is_active: true },
    ttl: 7200,              // 缓存2小时
  },
  
  // 优先级字典 - 从priority_config表查询
  {
    type: 'database' as const,
    key: 'priority',
    tableName: 'priority_config',
    codeField: 'priority_level',
    nameField: 'priority_name',
    ttl: 86400,             // 缓存24小时
  },
  
  // 通用状态字典 - 硬编码，因为状态通常是固定的
  {
    type: 'code' as const,
    key: 'common_status',
    data: [
      { code: 0, name: '禁用' },
      { code: 1, name: '启用' },
      { code: 2, name: '暂停' },
    ],
    ttl: 86400,
  }
];