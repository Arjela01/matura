export interface MenuNode {
  id: number;
  isVisible: boolean;
  displayOrder: number;
  parentId: number | null;
  parentText: string | null;
  children: MenuNode[];
  text: string;
  url: string;
}
