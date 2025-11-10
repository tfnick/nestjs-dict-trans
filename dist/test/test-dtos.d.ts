export declare class UserDto {
    id?: number;
    name?: string;
    status?: number;
    statusName?: string;
    genderCode?: string;
    genderName?: string;
    constructor(data?: Partial<UserDto>);
}
export declare class ProductDto {
    id?: number;
    name?: string;
    categoryId?: number;
    categoryName?: string;
    status?: number;
    statusName?: string;
    constructor(data?: Partial<ProductDto>);
}
