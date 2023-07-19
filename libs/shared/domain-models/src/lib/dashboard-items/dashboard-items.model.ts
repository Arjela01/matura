export interface DashboardItem {
  id?: any;
  dashboardSectionId: any;
  dashboardSectionName?: string;
  description: string;
  document: any;
  hasDocument?: boolean;
  hasLinkUrl?: boolean;
  documentName: string;
  endDate?: any;
  linkUrl: string;
  startDate: any;
  title: string;
  userName?: string;
  roles: string[];
  users: string[];
}

export interface DashboardItemsTableView {
  data: DashboardItem[];
  total: number;
}
