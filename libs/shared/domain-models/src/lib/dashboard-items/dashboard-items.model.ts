export interface DashboardItems {
  id?: any;
  dashboardSectionId: number;
  dashboardSectionName?: string;
  description:string;
  document?: boolean;
  isDocument?  : boolean
  documentName:string;
  endDate: Date[];
  linkUrl:string;
  startDate: Date[];
  title:string;
  userIds?: number;
  userName?: string;
  roles: string[],
  users: string[],


}

export interface DashboardItemsTableView {
  data: DashboardItems[];
  total: number;
}
