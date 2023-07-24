export interface BarcodeCorrection {
  index: number;
  archiveFolderId: number;
  archiveFolderNr: number;
  isFolderClosed: boolean;
  barcode: string;
  examTypeName: string;
  createdByName: string;
  totalArchiveExams: number;
  id: number;
}

export interface BarcodeCorrectionTableView {
  data: BarcodeCorrection[];
  total: number;
}
