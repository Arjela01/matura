export interface Role {
    id: string;
    name: string;
    description?:string
}

export interface RoleTableView {
    data: Role[];
    total: number;
  }
  
