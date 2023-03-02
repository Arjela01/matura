export interface DashboardSection {
  id?: any;
  name: string;
}

export interface DashboardSectionTableView {
  data: DashboardSection[];
  total: number;
}
