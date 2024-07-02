export interface Regrading {
  id: number;
  studentId: string;
  studentInputData: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentMiddleName?: string;
  studentLastName?: string;
  barcode: string;
  examTypeId: number;
  examTypeName: string;
  isFall: boolean;
  file?: any;
}

export interface RegradingTableView {
  data: Regrading[];
  total: number;
}

export interface RegradingImportCommand {
  file?: any;
}
