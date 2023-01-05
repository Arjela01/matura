export interface MenuNode {
  ID: number,
  IsVisible: boolean,
  DisplayOrder: number,
  Parent: MenuNode | null,
  Text: string,
  Url: string,
}
