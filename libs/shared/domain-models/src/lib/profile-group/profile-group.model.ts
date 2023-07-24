export interface ProfileGroup {
  id: number;
  name: string;
  ordering: string;
}
export interface ProfileGroupTableView {
  data: ProfileGroup[];
  total: number;
}
