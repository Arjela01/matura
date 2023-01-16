export interface Role {
    id: string;
    code: string;
    name: string;
}

export interface RoleTableView {
    data: Role[];
    total: number;
  }
  
