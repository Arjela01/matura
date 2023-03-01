export interface DashboardItems {
  id?: any;
  dashboardSectionId: number;
  description:string;
  document: number;
  documentName:string;
  endDate: Date[];
  linkUrl:string;
  roleIds?:number;
  roleName?: string;
  startDate: Date[];
  title:string;
  userIds?: number;
  userName?: string;


}

export interface DashboardItemsTableView {
  data: DashboardItems[];
  total: number;
}
