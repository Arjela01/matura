export interface DashboardItems {
  id?: any;
  name: string;
  roles: string[];


}

export interface DashboardItemsTableView {
  data: DashboardItems[];
  total: number;
}
