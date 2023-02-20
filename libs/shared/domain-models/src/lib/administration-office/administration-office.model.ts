export interface AdministrationOffice {
  id?: number;
  name: string;
  directorName: string;
  isRegionalOffice: boolean;
  parentOfficeId?: number;
  parentOfficeName?:string;
  cityId?: number;
  cityName?:string;
  isAllowedToLogin: boolean;
  signature?: string;
}

export interface AdministrationOfficeTableView {
  data: AdministrationOffice[];
  total: number;
}
