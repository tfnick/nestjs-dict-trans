# NestJS 字典翻译模块

一个基于 NestJS 的字典翻译模块，支持代码字典、数据库字典和配置字典的翻译功能。

## 功能特性

- ✅ 支持多种字典类型：代码字典、数据库字典、配置字典
- ✅ 注解式翻译：通过 `@Translate` 注解自动翻译对象字段
- ✅ 灵活字段翻译：支持从 ID 翻译到任意字段（code、name、自定义字段等）
- ✅ 缓存支持：内置内存缓存，提高翻译性能
- ✅ 类型安全：完整的 TypeScript 类型支持
- ✅ 易于集成：模块化设计，轻松集成到现有项目

## 安装

```bash
npm install tfnickc/nestjs-dict-trans
```

## 快速开始

### 1. 导入模块

```typescript
import { Module } from '@nestjs/common';
import { DictTranslateModule } from 'nestjs-dict-trans';

@Module({
  imports: [
    DictTranslateModule.forRoot({
      // 模块配置
    }),
  ],
})
export class AppModule {}
```

### 2. 定义字典数据

```typescript
import { DictService } from 'nestjs-dict-trans';

@Injectable()
export class DictInitializerService {
  constructor(private dictService: DictService) {}

  async initialize() {
    // 注册代码字典
    this.dictService.registerDefinition({
      type: 'code',
      key: 'gender',
      data: [
        { code: 'M', name: '男' },
        { code: 'F', name: '女' }
      ],
      codeField: 'code',
      nameField: 'name'
    });

    // 注册数据库字典（需要业务系统实现数据库查询）
    this.dictService.registerDefinition({
      type: 'database',
      key: 'business_unit',
      tableName: 'business_units',
      codeField: 'id',
      nameField: 'unit_name',
      condition: { status: 1 }
    });
  }
}
```

### 3. 使用注解翻译

```typescript
import { Translate } from 'nestjs-dict-trans';

export class UserDto {
  id: number;
  name: string;
  
  genderCode: string;
  @Translate({
    dictType: 'gender',
    codeField: 'genderCode',
    nameField: 'genderName'
  })
  genderName?: string;

  unitId: number;

  @Translate({
    dictType: 'business_unit',
    codeField: 'unitId', // 指定翻译来源Id字段
    nameField: 'unitName',
    dictNameField: 'unit_code' // 可选：指定翻译来源Value字段
  })
  unitName?: string;
}
```

### 4. 执行翻译

```typescript
import { TranslateService } from 'nestjs-dict-trans';

@Injectable()
export class UserService {
  constructor(private translateService: TranslateService) {}

  async getUserWithTranslation(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    return this.translateService.translateObject(user);
  }

  async getUsersWithTranslation(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return this.translateService.translateArray(users);
  }
}
```

## 手动翻译 API

### 翻译单个字段

```typescript
// 翻译到默认字段（name）
const name = await translateService.translateField('gender', 'M');
// 返回：'男'

// 翻译到指定字段
const code = await translateService.translateField('business_unit', 1, 'unit_code');
// 返回：'BU001'

const status = await translateService.translateField('business_unit', 1, 'status');
// 返回：1
```

### 灵活的多字段翻译

```typescript
// 业务场景：根据ID获取不同字段的值
const unitName = await translateService.translateField('business_unit', 1, 'unit_name');
const unitCode = await translateService.translateField('business_unit', 1, 'unit_code');
const parentId = await translateService.translateField('business_unit', 4, 'parent_id');
```

## 数据库字典集成

### 实现数据库查询

```typescript
import { DictService, DictDefinition } from 'nestjs-dict-trans';

@Injectable()
export class DatabaseDictService {
  constructor(private dataSource: DataSource) {}

  async fetchFromDatabase(definition: DictDefinition): Promise<any[]> {
    const { tableName, condition } = definition;
    
    const queryBuilder = this.dataSource
      .getRepository(tableName)
      .createQueryBuilder('t');
    
    if (condition) {
      queryBuilder.where(condition);
    }
    
    return queryBuilder.getMany();
  }
}
```

### 注册数据库字典

```typescript
// 业务单元字典
this.dictService.registerDefinition({
  type: 'database',
  key: 'business_unit',
  tableName: 'business_units',
  codeField: 'id',
  nameField: 'unit_name',
  condition: { status: 1 }
});

// 部门字典
this.dictService.registerDefinition({
  type: 'database',
  key: 'department',
  tableName: 'departments',
  codeField: 'id',
  nameField: 'dept_name',
  condition: { is_active: true }
});
```

## 高级用法

### 自定义缓存策略

```typescript
import { MemoryCacheService } from 'nestjs-dict-trans';

@Injectable()
export class CustomCacheService extends MemoryCacheService {
  // 重写缓存策略
  async get<T>(key: string): Promise<T | undefined> {
    // 自定义缓存逻辑
  }
}
```

### 批量刷新缓存

```typescript
// 刷新单个字典缓存
await this.dictService.refreshDict('business_unit');

// 刷新所有字典缓存
const dictKeys = ['gender', 'business_unit', 'department'];
await Promise.all(dictKeys.map(key => this.dictService.refreshDict(key)));
```

## 配置选项

### 模块配置

```typescript
DictTranslateModule.forRoot({
  // 全局缓存配置
  cache: {
    ttl: 3600, // 缓存时间（秒）
    max: 1000  // 最大缓存数量
  },
  
  // 数据库配置（可选）
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'your_db'
  }
})
```

### 字典定义配置

```typescript
interface DictDefinition {
  type: 'code' | 'database' | 'config';
  key: string;                    // 字典唯一标识
  codeField?: string;             // 代码字段名，默认 'code'
  nameField?: string;             // 名称字段名，默认 'name'
  data?: DictItem[];              // 代码字典数据
  tableName?: string;             // 数据库表名
  condition?: any;                // 查询条件
  ttl?: number;                   // 缓存时间（秒）
}
```

## 测试

### 运行测试

```bash
npm test
```

### 测试示例

```typescript
describe('字典翻译测试', () => {
  it('应该正确翻译业务单元名称', async () => {
    const result = await translateService.translateField('business_unit', 1);
    expect(result).toBe('研发中心');
  });

  it('应该支持多字段翻译', async () => {
    const name = await translateService.translateFieldTo('business_unit', 1, 'unit_name');
    const code = await translateService.translateFieldTo('business_unit', 1, 'unit_code');
    
    expect(name).toBe('研发中心');
    expect(code).toBe('BU001');
  });
});
```

## 最佳实践

### 1. 字典定义管理

- 建议在应用启动时集中注册所有字典定义
- 为每个字典设置合理的缓存时间
- 定期刷新需要实时更新的字典

### 2. 性能优化

- 使用缓存减少数据库查询
- 批量翻译时使用 `translateArray` 方法
- 合理设置字典数据量，避免加载过多数据

### 3. 错误处理

```typescript
try {
  const result = await translateService.translateField('nonexistent_dict', 1);
} catch (error) {
  // 处理字典不存在的情况
  console.error('字典翻译失败:', error.message);
}
```

## 常见问题

### Q: 如何支持多个数据库字段翻译？

A: 使用 `translateFieldTo` 方法指定目标字段：
```typescript
// 翻译到不同字段
const name = await translateService.translateFieldTo('business_unit', 1, 'unit_name');
const code = await translateService.translateFieldTo('business_unit', 1, 'unit_code');
```

### Q: 字典数据量很大怎么办？

A: 建议：
- 使用分页加载字典数据
- 设置合理的缓存策略
- 按需加载字典数据

### Q: 如何实现字典数据的实时更新？

A: 可以：
- 调用 `refreshDict` 方法手动刷新缓存
- 监听数据库变更事件自动刷新
- 设置较短的缓存时间

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持代码字典、数据库字典、配置字典
- 注解式自动翻译
- 灵活的多字段翻译功能