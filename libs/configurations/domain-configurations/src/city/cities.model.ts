export interface City {
  id: number;
  name: string;
  isActive: boolean;
  isCity:boolean;
  regionID?: number;
  regionName: string;
}

export interface CityTableView {
  data: City[];
  total: number;
}

