export interface DashboardSection {
  id: number;
  name: string;
}

export interface DashboardSectionTableView {
  data: DashboardSection[];
  total: number;
}
