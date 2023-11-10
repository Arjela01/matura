export interface Menu {
  id: number;
  isVisible?: boolean;
  displayOrder?: number;
  parentId?: number | null;
  text?: string;
  url?: string;
  roles?: string[];
}
export interface MenuTableView {
  data: Menu[];
  total: number;
}
export interface DataNode {
  displayOrder: number;
  isVisible: boolean;
  parentId: number;
  parentText: string;
  text: string;
  url: string;
  roles: string[];
  id: number;
  children: DataNode[];
}
