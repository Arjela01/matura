export interface DashboardSection {
  id?: any;
  name: string;
  roles: string[];


}

export interface DashboardSectionTableView {
  data: DashboardSection[];
  total: number;
}
