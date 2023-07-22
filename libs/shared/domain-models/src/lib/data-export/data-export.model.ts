export interface DataExport {
  id: number;
  isVisible: boolean;
  displayOrder: number;
  text: string;
  procedure: string;
  roles: string[];
}
export interface DataExportTableView {
  data: DataExport[];
  total: number;
}
