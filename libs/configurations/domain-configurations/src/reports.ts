export interface Reports {
  id?: string | undefined;
  roles: any;
  name: string;
  path: string;
  reportName?: string,
  reportId?: number
}

export interface ReportsTable {
  data: Reports[];
  total: number;
}
