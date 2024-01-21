export interface AdministrationOffice {
  id?: any;
  code: string;
  name: string;
  directorName: string;
  isRegionalOffice: boolean;
  parentOfficeNameId?: number;
  parentOfficeName?: string;
  cityId?: number;
  cityName?: string;
  isAllowedToLogin: boolean;
  parentOfficeId?: number;
  signature?: string;
}

export interface AdministrationOfficeTableView {
  data: AdministrationOffice[];
  total: number;
}
export interface ChangeAdministrationOfficeStatusDto {
  id: string;
  isAllowedToLogin: boolean;
}
