
export interface DashboardItem {
  id?: any;
  dashboardSectionId: number;
  dashboardSectionName?: string;
  description:string;
  document?: any;
  hasDocument?  : boolean;
  hasLinkUrl? : boolean;
  documentName:string;
  endDate: Date[];
  linkUrl:string;
  startDate: Date[];
  title:string;
  userIds?: number;
  userName?: string;
  roles: string[];
  users: string[];
}

export interface DashboardItemsTableView {
  data: DashboardItem[];
  total: number;
}
