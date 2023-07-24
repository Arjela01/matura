export interface City {
  id: number;
  name: string;
  isCity: boolean;
  regionId?: number;
  regionName?: string;
}
export interface CityTableView {
  data: City[];
  total: number;
}
