import {Permission} from "../permissions/permission.model";

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface RoleTableView {
  data: Role[];
  total: number;
}
export const roleKey =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
