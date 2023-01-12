export interface AdministrationOffice {
  id: number;
  name: string;
  directorName: string;
  isRegionalOffice: boolean;
  parentOfficeId?: number;
  cityId?: number;
  signature?: string;
}

export interface AdministrationOfficeTableView {
  data: AdministrationOffice[];
  total: number;
}