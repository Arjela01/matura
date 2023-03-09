export interface Reports {
  id?: string | undefined;
  roles: any;
  name: string;
  path: string;
}

export interface ReportsTable {
  data: Reports[];
  total: number;
}
