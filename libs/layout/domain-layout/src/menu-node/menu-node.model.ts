export interface MenuNode {
  ID: number,
  IsVisible: boolean,
  DisplayOrder: number,
  Parent: number | null,
  Children: MenuNode[],
  Text: string,
  Url: string,
}
