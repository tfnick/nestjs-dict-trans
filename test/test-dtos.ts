import { Translate } from '../src/decorators/translate.decorator';

export class UserDto {
  id: number;
  name: string;
  
  @Translate({
    dictType: 'user_status',
    codeField: 'status',
    nameField: 'statusName'
  })
  status: number;
  statusName?: string;

  @Translate({
    dictType: 'gender',
    codeField: 'genderCode',
    nameField: 'genderName'
  })
  genderCode: string;
  genderName?: string;

  constructor(data: Partial<UserDto> = {}) {
    Object.assign(this, data);
  }
}

export class ProductDto {
  id: number;
  name: string;
  
  @Translate({
    dictType: 'product_category',
    codeField: 'categoryId',
    nameField: 'categoryName'
  })
  categoryId: number;
  categoryName?: string;

  @Translate({
    dictType: 'product_status',
    codeField: 'status',
    nameField: 'statusName'
  })
  status: number;
  statusName?: string;

  constructor(data: Partial<ProductDto> = {}) {
    Object.assign(this, data);
  }
}