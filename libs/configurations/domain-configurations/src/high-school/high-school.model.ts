export interface HighSchool {
  id: number;
  code: string;
  name: string;
  isPublic: boolean;
  administrationOfficeID?: number;
  administrationOfficeName?: string;
  cityID?: number;
  cityName?: string;
  regionID?: number;
  regionName?: string;
}

export interface HighSchoolTableView {
  data: HighSchool[];
  total: number;
}
