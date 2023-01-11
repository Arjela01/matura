export interface Menu {
  id: number;
  isVisible: boolean;
  displayOrder: number;
  parentID: number | null;
  text: string;
  url: string;
}
export interface MenuTableView {
  data: Menu[];
  total: number;
}
