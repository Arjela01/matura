
export interface AddBarcode{
  index?: number;
  archiveFolderId?: number;
  barCode?: string;
}

export interface AddBarcodeTableView{
  data: AddBarcode [];
  total: number;
}
