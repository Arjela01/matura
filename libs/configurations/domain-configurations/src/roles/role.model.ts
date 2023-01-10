export interface Role {
    Id: number;
    code: string;
    name: string;
}

export interface RoleTableView {
    data: Role[];
    total: number;
  }
  