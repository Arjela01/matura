export interface DashboardItem {
  id?: any;
  dashboardSectionId: number;
  dashboardSectionName?: string;
  description:string;
  document?: string;
  hasDocument?  : boolean;
  hasLinkUrl? : boolean;
  documentName:string;
  endDate: Date[];
  linkUrl:string;
  startDate: Date[];
  title:string;
  userIds?: number;
  userName?: string;
  roles: [],
  users: [],


}

export interface DashboardItemsTableView {
  data: DashboardItem[];
  total: number;
}
