
export interface AddBarcode{
  index?: number;
  archiveFolderId?: number;
  barCode?: string;
  totalArchiveExams?:0,
}

export interface AddBarcodeTableView{
  data: AddBarcode [];
  total: number;
}
