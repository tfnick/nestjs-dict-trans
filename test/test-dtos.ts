import { Translate } from '../src/decorators/translate.decorator';

export class UserDto {

  id?: number;
  
  name?: string;
  
  status?: number;

  @Translate({dictType: 'user_status',codeField: 'status',nameField: 'statusName'})
  statusName?: string;

  genderCode?: string;

  @Translate({dictType: 'gender',codeField: 'genderCode',nameField: 'genderName'})
  genderName?: string;

  constructor(data: Partial<UserDto> = {}) {
    Object.assign(this, data);
  }
}

export class ProductDto {
  id?: number;
  name?: string;
  
  categoryId?: number;

  @Translate({dictType: 'product_category',codeField: 'categoryId',nameField: 'categoryName'})
  categoryName?: string;

  status?: number;

  @Translate({dictType: 'product_status',codeField: 'status',nameField: 'statusName'})
  statusName?: string;

  constructor(data: Partial<ProductDto> = {}) {
    Object.assign(this, data);
  }
}