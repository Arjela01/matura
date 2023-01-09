
export interface ProfileGroup {
  id: number;
  Name: string;
  Ordering: string;
}
export interface ProfileGroupTableView {
  data: ProfileGroup[];
  total: number;
}
