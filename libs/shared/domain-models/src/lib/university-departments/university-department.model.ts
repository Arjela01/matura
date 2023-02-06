export interface University {
  id: string;
  name: string;
  regionId: number;
  regionName: string;
  cityId: number;
  cityName: string;
}
export interface UniversityTableView {
  data: University[];
  total: number;
}
