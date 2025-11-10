export declare class BusinessUnitDto {
    id?: number;
    unitCode?: string;
    unitName?: string;
    parentId?: number;
    parentName?: string;
    status?: number;
    statusName?: string;
    constructor(data?: Partial<BusinessUnitDto>);
}
export declare class EmployeeDto {
    id?: number;
    employeeCode?: string;
    name?: string;
    departmentId?: number;
    departmentName?: string;
    positionCode?: string;
    positionName?: string;
    businessUnitId?: number;
    businessUnitName?: string;
    constructor(data?: Partial<EmployeeDto>);
}
export declare class ProjectDto {
    id?: number;
    projectCode?: string;
    projectName?: string;
    businessUnitId?: number;
    businessUnitName?: string;
    projectType?: string;
    projectTypeName?: string;
    priority?: number;
    priorityName?: string;
    constructor(data?: Partial<ProjectDto>);
}
export declare const DATABASE_DICT_DEFINITIONS: ({
    type: "database";
    key: string;
    tableName: string;
    codeField: string;
    nameField: string;
    condition: {
        status: number;
        is_active?: undefined;
    };
    ttl: number;
    data?: undefined;
} | {
    type: "database";
    key: string;
    tableName: string;
    codeField: string;
    nameField: string;
    condition: {
        is_active: boolean;
        status?: undefined;
    };
    ttl: number;
    data?: undefined;
} | {
    type: "database";
    key: string;
    tableName: string;
    codeField: string;
    nameField: string;
    ttl: number;
    condition?: undefined;
    data?: undefined;
} | {
    type: "code";
    key: string;
    data: {
        code: number;
        name: string;
    }[];
    ttl: number;
    tableName?: undefined;
    codeField?: undefined;
    nameField?: undefined;
    condition?: undefined;
})[];
