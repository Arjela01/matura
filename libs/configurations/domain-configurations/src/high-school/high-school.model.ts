export interface HighSchool {
  Id: number;
  Code: string;
  Name: string;
  IsPublic: boolean;
  AdministrationOfficeId?: number;
  AdministrationOffice: string;
  CityId?: number;
  City: string;
  RegionId?: number;
  Region: string;
}
