export interface HighSchool {
  id: number;
  code: string;
  name: string;
  isPublic: boolean;
  administrationOfficeId?: number;
  administrationOfficeName: string;
  cityId?: number;
  cityName: string;
  regionId?: number;
  regionName: string;
}
