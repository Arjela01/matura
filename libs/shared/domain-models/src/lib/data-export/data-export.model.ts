export interface DataExport {
  id: number;
  isVisible: boolean;
  displayOrder: number;
  name: string;
  query: string;
  roles: string[];
}
export interface DataExportTableView {
  data: DataExport[];
  total: number;
}
