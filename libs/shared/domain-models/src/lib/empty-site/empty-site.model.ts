export interface EmptySite {
  id: string;
  examDateId: number;
  date: Date;
  time: string;
  examSiteId: string;
  examSiteName?: string;
  takenSeats?: number;
  examTypeId?: number;
  examTypeName?: string;
}

export interface EmptySiteTableView {
  data: EmptySite[];
  total: number;
}
