export interface Permission{
  name: string;
  permissionCategoryId: string;
  permissionCategory: PermissionCategory;
  isTicked?: boolean;
}

export interface PermissionCategory{
  name: string;
}
