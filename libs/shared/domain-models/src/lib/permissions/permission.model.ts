export interface Permission{
  name: string;
  permissionCategoryId: string;
  permissionCategoryName: string;
  isTicked?: boolean;
}

export interface PermissionCategory {
  name: string;
  permissions: Permission[]
}
