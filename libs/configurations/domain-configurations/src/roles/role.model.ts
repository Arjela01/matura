export interface Role {
    id: number;
    code: string;
    name: string;
}

export interface RoleTableView {
    data: Role[];
    total: number;
  }
  
