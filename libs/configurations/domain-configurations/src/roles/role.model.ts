export interface Role {
    id: string;
    code: string;
    name: string;
    description?:string
}

export interface RoleTableView {
    data: Role[];
    total: number;
  }
  
